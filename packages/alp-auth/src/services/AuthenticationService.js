/* eslint camelcase: 'off', max-lines: 'off' */
import EventEmitter from 'events';
import promiseCallback from 'promise-callback-factory';
import Logger from 'nightingale-logger';
import { randomHex } from '../utils/generators';
import UserAccountsService from './user/UserAccountsService';

const logger = new Logger('alp:auth:authentication');

type GenerateAuthUrlOptionsType = {
  accessType?: string,
  grantType?: string,
  includeGrantedScopes?: boolean,
  loginHint?: string,
  prompt?: string,
  redirectUri?: string,
  scope?: string,
  state?: string,
};

type GetTokensOptionsType = {
  code: string,
  redirectUri: string,
};

export default class AuthenticationService extends EventEmitter {
  config: Object;
  strategies: Object;
  userAccountsService: UserAccountsService;

  constructor(config, strategies: Object, userAccountsService: UserAccountsService) {
    super();
    this.config = config;
    this.strategies = strategies;
    this.userAccountsService = userAccountsService;
  }

  /**
   * @param {string} strategy
   * @param {Object} options
   * @param {string} [options.redirectUri]
   * @param {string} [options.scope]
   * Space-delimited set of permissions that the application requests.
   * @param {string} [options.state]
   * Any string that might be useful to your application upon receipt of the response
   * @param {string} [options.grantType]
   * @param {string} [options.accessType = 'online']
   * online or offline
   * @param {string} [options.prompt]
   * Space-delimited, case-sensitive list of prompts to present the user.
   * Values: none, consent, select_account
   * @param {string} [options.loginHint] email address or sub identifier
   * @param {boolean} [options.includeGrantedScopes]
   * If this is provided with the value true, and the authorization request is granted,
   * the authorization will include any previous authorizations granted
   * to this user/application combination for other scopes
   * @returns {string}
   */
  generateAuthUrl(strategy: string, options: GenerateAuthUrlOptionsType = {}) {
    logger.debug('generateAuthUrl', { strategy, options });
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case 'oauth2':
        return strategyInstance.oauth2.authorizationCode.authorizeURL({
          redirect_uri: options.redirectUri,
          scope: options.scope,
          state: options.state,
          grant_type: options.grantType,
          access_type: options.accessType,
          login_hint: options.loginHint,
          include_granted_scopes: options.includeGrantedScopes,
        });
    }
  }

  getTokens(strategy: string, options: GetTokensOptionsType = {}) {
    logger.debug('getTokens', { strategy, options });
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case 'oauth2':
        return promiseCallback(done => {
          strategyInstance.oauth2.authorizationCode.getToken(
            {
              code: options.code,
              redirect_uri: options.redirectUri,
            },
            done,
          );
        }).then(
          result =>
            result && {
              accessToken: result.access_token,
              refreshToken: result.refresh_token,
              tokenType: result.token_type,
              expiresIn: result.expires_in,
              expireDate: (() => {
                const d = new Date();
                d.setTime(d.getTime() + result.expires_in * 1000);
                return d;
              })(),
              idToken: result.id_token,
            },
          // return strategyInstance.accessToken.create(result);
        );
    }
  }

  refreshToken(strategy: string, tokens) {
    logger.debug('refreshToken', { strategy });
    if (!tokens.refreshToken) {
      throw new Error('Missing refresh token');
    }
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case 'oauth2': {
        const token = strategyInstance.oauth2.accessToken.create({
          refresh_token: tokens.refreshToken,
        });
        return promiseCallback(done => token.refresh(done)).then(result => {
          const tokens = result.token;
          return (
            result && {
              accessToken: tokens.access_token,
              tokenType: tokens.token_type,
              expiresIn: tokens.expires_in,
              expireDate: (() => {
                const d = new Date();
                d.setTime(d.getTime() + tokens.expires_in * 1000);
                return d;
              })(),
              idToken: tokens.id_token,
            }
          );
        });
      }
    }
  }

  redirectUri(ctx, strategy: string) {
    const host = `http${this.config.get('allowHttps') ? 's' : ''}://${ctx.request.host}`;
    return `${host}${ctx.urlGenerator('loginResponse', { strategy })}`;
  }

  /**
   *
   * @param {Koa.Context} ctx
   * @param {string} strategy
   * @param {string} [refreshToken]
   * @param {string} [scopeKey='login']
   * @param user
   * @param accountId
   * @returns {*}
   */
  async redirectAuthUrl(
    ctx: Object,
    strategy: string,
    refreshToken: ?string,
    scopeKey: ?string,
    user,
    accountId,
  ) {
    logger.debug('redirectAuthUrl', { strategy, scopeKey, refreshToken });
    const state = await randomHex(8);
    const isLoginAccess = !scopeKey || scopeKey === 'login';
    const scope = this.userAccountsService.getScope(strategy, scopeKey || 'login', user, accountId);

    ctx.cookies.set(
      `auth_${strategy}_${state}`,
      JSON.stringify({
        scopeKey,
        scope,
        isLoginAccess,
      }),
      {
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
        secure: this.config.get('allowHttps'),
      },
    );
    const redirectUri = this.generateAuthUrl(strategy, {
      redirectUri: this.redirectUri(ctx, strategy),
      scope,
      state,
      accessType: refreshToken ? 'offline' : 'online',
    });

    return ctx.redirect(redirectUri);
  }

  /**
   * @param {Koa.Context} ctx
   * @param {string} strategy
   * @param {boolean} isConnected
   * @returns {*}
   */
  async accessResponse(ctx, strategy: string, isConnected: ?boolean) {
    if (ctx.query.error) {
      const error = new Error(ctx.query.error);
      error.status = 403;
      error.expose = true;
      throw error;
    }

    const code = ctx.query.code;
    const state = ctx.query.state;
    const cookieName = `auth_${strategy}_${state}`;
    let cookie = ctx.cookies.get(cookieName);
    ctx.cookies.set(cookieName, '', { expires: new Date(1) });
    if (!cookie) {
      throw new Error('No cookie for this state');
    }

    cookie = JSON.parse(cookie);
    if (!cookie || !cookie.scope) {
      throw new Error('Unexpected cookie value');
    }

    if (!cookie.isLoginAccess) {
      if (!isConnected) {
        throw new Error('You are not connected');
      }
    }

    const tokens = await this.getTokens(strategy, {
      code,
      redirectUri: this.redirectUri(ctx, strategy),
    });

    if (cookie.isLoginAccess) {
      const user = await this.userAccountsService.findOrCreateFromGoogle(
        strategy,
        tokens,
        cookie.scope,
        cookie.scopeKey,
      );
      return user;
    }

    ctx.cookies.set(cookieName, '', { expires: new Date(1) });
    const connectedUser = ctx.state.connected;
    await this.userAccountsService.update(
      connectedUser,
      strategy,
      tokens,
      cookie.scope,
      cookie.scopeKey,
    );
    return connectedUser;
  }

  refreshAccountTokens(user, account) {
    if (account.tokenExpireDate && account.tokenExpireDate.getTime() > Date.now()) {
      return Promise.resolve(false);
    }
    return this.refreshToken(account.provider, {
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
    }).then(tokens => {
      if (!tokens) {
        // serviceGoogle.updateFields({ accessToken:null, refreshToken:null, status: .OUTDATED });
        return false;
      }
      account.accessToken = tokens.accessToken;
      account.tokenExpireDate = tokens.expireDate;
      return this.userAccountsService.updateAccount(user, account).then(() => true);
    });
  }
}
