/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable camelcase, max-lines */
import { EventEmitter } from 'events';
import 'alp-router';
import type { Context, NodeConfig } from 'alp-types';
import Logger from 'nightingale-logger';
import type { OAuthClient } from 'simple-oauth2';
import type { AccountId, User, Account, UserSanitized } from '../../../types.d';
import { randomHex } from '../../utils/generators';
import type UserAccountsService from '../user/UserAccountsService';
import type { AllowedStrategyKeys, Tokens } from './types';

const logger = new Logger('alp:auth:authentication');

export interface GenerateAuthUrlOptions {
  accessType?: string;
  grantType?: string;
  includeGrantedScopes?: boolean;
  loginHint?: string;
  prompt?: string;
  redirectUri?: string;
  scope?: string;
  state?: string;
}

export interface GetTokensOptions {
  code: string;
  redirectUri: string;
}

export interface Strategy {
  type: string;
}

export interface Oauth2Strategy<Params extends string> extends Strategy {
  oauth2: OAuthClient<Params>;
}

export type Strategies<StrategyKeys extends AllowedStrategyKeys> = Record<
  StrategyKeys,
  Oauth2Strategy<any>
>;

export interface AccessResponseHooks<StrategyKeys, U extends User = User> {
  afterLoginSuccess?: <StrategyKey extends StrategyKeys>(
    strategy: StrategyKey,
    connectedUser: U,
  ) => void | Promise<void>;

  afterScopeUpdate?: <StrategyKey extends StrategyKeys>(
    strategy: StrategyKey,
    scopeKey: string,
    account: Account,
    user: U,
  ) => void | Promise<void>;
}

export class AuthenticationService<
  StrategyKeys extends AllowedStrategyKeys,
  U extends User = User,
  USanitized extends UserSanitized = UserSanitized,
> extends EventEmitter {
  config: NodeConfig;

  strategies: Strategies<StrategyKeys>;

  userAccountsService: UserAccountsService<StrategyKeys, U, USanitized>;

  constructor(
    config: NodeConfig,
    strategies: Strategies<StrategyKeys>,
    userAccountsService: UserAccountsService<StrategyKeys, U, USanitized>,
  ) {
    super();
    this.config = config;
    this.strategies = strategies;
    this.userAccountsService = userAccountsService;
  }

  generateAuthUrl<T extends StrategyKeys>(strategy: T, params: any): string {
    logger.debug('generateAuthUrl', { strategy, params });
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case 'oauth2':
        return strategyInstance.oauth2.authorizationCode.authorizeURL(params);
      default:
        throw new Error('Invalid strategy');
    }
  }

  async getTokens(
    strategy: StrategyKeys,
    options: GetTokensOptions,
  ): Promise<Tokens> {
    logger.debug('getTokens', { strategy, options });
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case 'oauth2': {
        const result = await strategyInstance.oauth2.authorizationCode.getToken(
          {
            code: options.code,
            redirect_uri: options.redirectUri,
          },
        );
        if (!result) return result;
        return {
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
        };
        // return strategyInstance.accessToken.create(result);
      }

      default:
        throw new Error('Invalid stategy');
    }
  }

  async refreshToken(
    strategy: StrategyKeys,
    tokensParam: { refreshToken: string },
  ): Promise<Tokens> {
    logger.debug('refreshToken', { strategy });
    if (!tokensParam.refreshToken) {
      throw new Error('Missing refresh token');
    }
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case 'oauth2': {
        const token = strategyInstance.oauth2.accessToken.create({
          refresh_token: tokensParam.refreshToken,
        });
        const result = await token.refresh();
        const tokens = result.token;
        return {
          accessToken: tokens.access_token,
          tokenType: tokens.token_type,
          expiresIn: tokens.expires_in,
          expireDate: (() => {
            const d = new Date();
            d.setTime(d.getTime() + tokens.expires_in * 1000);
            return d;
          })(),
          idToken: tokens.id_token,
        };
      }

      default:
        throw new Error('Invalid stategy');
    }
  }

  redirectUri(ctx: Context, strategy: string): string {
    const host = `http${this.config.get('allowHttps') ? 's' : ''}://${
      ctx.request.host
    }`;
    return `${host}${ctx.urlGenerator('loginResponse', { strategy })}`;
  }

  async redirectAuthUrl(
    ctx: Context,
    strategy: StrategyKeys,
    {
      refreshToken,
      scopeKey,
      user,
      accountId,
    }: {
      refreshToken?: string | undefined;
      scopeKey?: string | undefined;
      user?: U;
      accountId?: AccountId;
    },
    params?: any,
  ): Promise<void> {
    logger.debug('redirectAuthUrl', { strategy, scopeKey, refreshToken });
    const state = await randomHex(8);
    const isLoginAccess = !scopeKey || scopeKey === 'login';
    const scope = this.userAccountsService.getScope(
      strategy,
      scopeKey || 'login',
      user,
      accountId,
    );

    if (!scope) {
      throw new Error('Invalid empty scope');
    }

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
      redirect_uri: this.redirectUri(ctx, strategy),
      scope,
      state,
      access_type: refreshToken ? 'offline' : 'online',
      ...params,
    });

    return ctx.redirect(redirectUri);
  }

  async accessResponse<StrategyKey extends StrategyKeys>(
    ctx: any,
    strategy: StrategyKey,
    isConnected: undefined | boolean,
    hooks: AccessResponseHooks<StrategyKeys, U>,
  ): Promise<U> {
    if (ctx.query.error) {
      const error: any = new Error(ctx.query.error);
      error.status = 403;
      error.expose = true;
      throw error;
    }

    const code = ctx.query.code;
    const state = ctx.query.state;
    const cookieName = `auth_${strategy}_${state as string}`;
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

    const tokens: Tokens = await this.getTokens(strategy, {
      code,
      redirectUri: this.redirectUri(ctx, strategy),
    });

    if (cookie.isLoginAccess) {
      const user = await this.userAccountsService.findOrCreateFromStrategy(
        strategy,
        tokens,
        cookie.scope,
        cookie.scopeKey,
      );

      if (hooks.afterLoginSuccess) {
        await hooks.afterLoginSuccess(strategy, user);
      }

      return user;
    }

    const connectedUser = ctx.state.user;
    const { account, user } = await this.userAccountsService.update(
      connectedUser,
      strategy,
      tokens,
      cookie.scope,
      cookie.scopeKey,
    );

    if (hooks.afterScopeUpdate) {
      await hooks.afterScopeUpdate(strategy, cookie.scopeKey, account, user);
    }

    return connectedUser;
  }

  refreshAccountTokens(user: U, account: Account): Promise<boolean> {
    if (
      account.tokenExpireDate &&
      account.tokenExpireDate.getTime() > Date.now()
    ) {
      return Promise.resolve(false);
    }
    return this.refreshToken(account.provider as StrategyKeys, {
      // accessToken: account.accessToken,
      refreshToken: account.refreshToken!,
    }).then((tokens: Tokens) => {
      if (!tokens) {
        // serviceGoogle.updateFields({ accessToken:null, refreshToken:null, status: .OUTDATED });
        return false;
      }
      account.accessToken = tokens.accessToken;
      account.tokenExpireDate = tokens.expireDate;
      return this.userAccountsService
        .updateAccount(user, account)
        .then(() => true);
    });
  }
}
