import { promisify } from 'util';
import { sign, verify } from 'jsonwebtoken';
import Logger from 'nightingale-logger';
import EventEmitter from 'events';
import { randomBytes } from 'crypto';

const randomBytesPromisified = promisify(randomBytes);
async function randomHex(size) {
  const buffer = await randomBytesPromisified(size);
  return buffer.toString('hex');
}

/* eslint camelcase: 'off', max-lines: 'off' */
const logger = new Logger('alp:auth:authentication');
class AuthenticationService extends EventEmitter {
  constructor(config, strategies, userAccountsService) {
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


  generateAuthUrl(strategy, options = {}) {
    logger.debug('generateAuthUrl', {
      strategy,
      options
    });
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
          include_granted_scopes: options.includeGrantedScopes
        });
    }
  }

  async getTokens(strategy, options = {}) {
    logger.debug('getTokens', {
      strategy,
      options
    });
    const strategyInstance = this.strategies[strategy];

    switch (strategyInstance.type) {
      case 'oauth2':
        {
          const result = await strategyInstance.oauth2.authorizationCode.getToken({
            code: options.code,
            redirect_uri: options.redirectUri
          });
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
            idToken: result.id_token
          }; // return strategyInstance.accessToken.create(result);
        }

      default:
        throw new Error('Invalid stategy');
    }
  }

  async refreshToken(strategy, tokensParam) {
    logger.debug('refreshToken', {
      strategy
    });

    if (!tokensParam.refreshToken) {
      throw new Error('Missing refresh token');
    }

    const strategyInstance = this.strategies[strategy];

    switch (strategyInstance.type) {
      case 'oauth2':
        {
          const token = strategyInstance.oauth2.accessToken.create({
            refresh_token: tokensParam.refreshToken
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
            idToken: tokens.id_token
          };
        }

      default:
        throw new Error('Invalid stategy');
    }
  }

  redirectUri(ctx, strategy) {
    const host = `http${this.config.get('allowHttps') ? 's' : ''}://${ctx.request.host}`;
    return `${host}${ctx.urlGenerator('loginResponse', {
      strategy
    })}`;
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


  async redirectAuthUrl(ctx, strategy, refreshToken, scopeKey, user, accountId) {
    logger.debug('redirectAuthUrl', {
      strategy,
      scopeKey,
      refreshToken
    });
    const state = await randomHex(8);
    const scope = this.userAccountsService.getScope(strategy, scopeKey || 'login', user, accountId);
    ctx.cookies.set(`auth_${strategy}_${state}`, JSON.stringify({
      scopeKey,
      scope,
      isLoginAccess: !scopeKey || scopeKey === 'login'
    }), {
      maxAge: 600000,
      httpOnly: true,
      secure: this.config.get('allowHttps')
    });
    const redirectUri = this.generateAuthUrl(strategy, {
      redirectUri: this.redirectUri(ctx, strategy),
      scope,
      state,
      accessType: refreshToken ? 'offline' : 'online'
    });
    return ctx.redirect(redirectUri);
  }
  /**
   * @param {Koa.Context} ctx
   * @param {string} strategy
   * @param {boolean} isConnected
   * @returns {*}
   */


  async accessResponse(ctx, strategy, isConnected) {
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
    ctx.cookies.set(cookieName, '', {
      expires: new Date(1)
    });

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
      redirectUri: this.redirectUri(ctx, strategy)
    });

    if (cookie.isLoginAccess) {
      const user = await this.userAccountsService.findOrCreateFromGoogle(strategy, tokens, cookie.scope, cookie.scopeKey);
      return user;
    }

    ctx.cookies.set(cookieName, '', {
      expires: new Date(1)
    });
    const connectedUser = ctx.state.connected;
    await this.userAccountsService.update(connectedUser, strategy, tokens, cookie.scope, cookie.scopeKey);
    return connectedUser;
  }

  refreshAccountTokens(user, account) {
    if (account.tokenExpireDate && account.tokenExpireDate.getTime() > Date.now()) {
      return Promise.resolve(false);
    }

    return this.refreshToken(account.provider, {
      // accessToken: account.accessToken,
      refreshToken: account.refreshToken
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

var _class, _temp;
var userAccountGoogleService = new (_temp = _class = class extends EventEmitter {
  constructor(...args) {
    super(...args);
    this.providerKey = 'google';
  }

  getProfile(tokens) {
    return fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokens.accessToken}`).then(response => response.json());
  }

  isAccount(account, profile) {
    return account.googleId === profile.id;
  }

  getId(profile) {
    return profile.id;
  }

  getAccountName(profile) {
    return profile.email;
  }

  getEmails(profile, plusProfile) {
    const emails = [];

    if (profile.email) {
      emails.push(profile.email);
    }

    if (plusProfile.emails) {
      plusProfile.emails.forEach(email => {
        if (emails.indexOf(email.value) === -1) {
          emails.push(email.value);
        }
      });
    }

    return emails;
  }

  getDisplayName(profile) {
    return profile.name;
  }

  getFullName(profile) {
    return {
      givenName: profile.given_name,
      familyName: profile.family_name
    };
  }

  getDefaultScope(newScope) {
    return this.getScope(undefined, newScope);
  }

  getScope(oldScope, newScope) {
    return !oldScope ? newScope.split(' ') : oldScope.concat(newScope.split(' ')).filter((item, i, ar) => ar.indexOf(item) === i);
  }

}, _class.scopeKeyToScope = {
  login: 'openid profile email https://www.googleapis.com/auth/plus.profile.emails.read'
}, _temp)();

/* global fetch */
const logger$1 = new Logger('alp:auth:userAccounts');
class UserAccountsService extends EventEmitter {
  constructor(usersManager) {
    super();
    this.usersManager = usersManager;
  }

  getScope(strategy, scopeKey, user, accountId) {
    logger$1.debug('getScope', {
      strategy,
      userId: user && user._id
    });
    const service = UserAccountsService.strategyToService[strategy];
    const newScope = service.constructor.scopeKeyToScope[scopeKey];

    if (!user || !accountId) {
      return newScope;
    }

    const account = user.accounts.find(account => account.provider === strategy && account.accountId === accountId);

    if (!account) {
      throw new Error('Could not found associated account');
    }

    return service.getScope(account.scope, newScope).join(' ');
  }

  async update(user, strategy, tokens, scope, subservice) {
    const service = UserAccountsService.strategyToService[strategy];
    const profile = await service.getProfile(tokens);
    const account = user.accounts.find(account => account.provider === strategy && service.isAccount(account, profile));

    if (!account) {
      // TODO check if already exists in other user => merge
      // TODO else add a new account in this user
      throw new Error('Could not found associated account');
    }

    account.status = 'valid';
    account.accessToken = tokens.accessToken;

    if (tokens.refreshToken) {
      account.refreshToken = tokens.refreshToken;
    }

    if (tokens.expireDate) {
      account.tokenExpireDate = tokens.expireDate;
    }

    account.scope = service.getScope(account.scope, scope);
    account.subservices = account.subservices || [];

    if (subservice && account.subservices.indexOf(subservice) === -1) {
      account.subservices.push(subservice);
    }

    await this.usersManager.update(user);
    return user;
  }

  async findOrCreateFromGoogle(strategy, tokens, scope, subservice) {
    if (strategy !== 'google') {
      throw new Error('Not supported at the moment');
    }

    const service = UserAccountsService.strategyToService[strategy];
    const profile = await service.getProfile(tokens);
    const plusProfile = await fetch(`https://www.googleapis.com/plus/v1/people/me?access_token=${tokens.accessToken}`).then(response => response.json());
    const emails = service.getEmails(profile, plusProfile);
    let user = await this.usersManager.findOneByAccountOrEmails({
      provider: service.providerKey,
      accountId: service.getId(profile),
      emails
    });
    logger$1.info(!user ? 'create user' : 'existing user', {
      emails,
      user
    });

    if (!user) {
      user = {};
    }

    Object.assign(user, {
      displayName: service.getDisplayName(profile),
      fullName: service.getFullName(profile),
      status: this.usersManager.STATUSES.VALIDATED
    });
    if (!user.accounts) user.accounts = [];
    const accountId = service.getId(profile);
    let account = user.accounts.find(account => account.provider === strategy && account.accountId === accountId);

    if (!account) {
      account = {
        provider: strategy,
        accountId
      };
      user.accounts.push(account);
    }

    account.name = service.getAccountName(profile);
    account.status = 'valid';
    account.profile = profile;
    account.accessToken = tokens.accessToken;

    if (tokens.refreshToken) {
      account.refreshToken = tokens.refreshToken;
    }

    if (tokens.expireDate) {
      account.tokenExpireDate = tokens.expireDate;
    }

    account.scope = service.getScope(account.scope, scope);
    if (!account.subservices) account.subservices = [];

    if (subservice && !account.subservices.includes(subservice)) {
      account.subservices.push(subservice);
    }

    if (!user.emails) user.emails = [];
    const userEmails = user.emails;
    emails.forEach(email => {
      if (!userEmails.includes(email)) {
        userEmails.push(email);
      }
    });
    user.emailDomains = [...user.emails.reduce((domains, email) => domains.add(email.split('@', 2)[1]), new Set())];
    const keyPath = this.usersManager.store.keyPath;
    await this.usersManager[user[keyPath] ? 'updateOne' : 'insertOne'](user);
    return user;
  }

  async updateAccount(user, account) {
    await this.usersManager.updateAccount(user, account);
    return user;
  }

}
UserAccountsService.strategyToService = {
  google: userAccountGoogleService
};

function createAuthController({
  usersManager,
  authenticationService,
  homeRouterKey = '/'
}) {
  return {
    async login(ctx) {
      const strategy = ctx.namedParam('strategy');
      if (!strategy) throw new Error('Strategy missing');
      await authenticationService.redirectAuthUrl(ctx, strategy);
    },

    async loginResponse(ctx) {
      if (ctx.state.connected) {
        ctx.redirect(ctx.urlGenerator(homeRouterKey));
      }

      const strategy = ctx.namedParam('strategy');
      ctx.assert(strategy);
      const connectedUser = await authenticationService.accessResponse(ctx, strategy);
      const keyPath = usersManager.store.keyPath;
      await ctx.setConnected(connectedUser[keyPath], connectedUser);
      ctx.state.connected = connectedUser;
      await ctx.redirect(ctx.urlGenerator(homeRouterKey));
    },

    async logout(ctx) {
      ctx.logout();
      await ctx.redirect(ctx.urlGenerator(homeRouterKey));
    }

  };
}

class MongoUsersManager {
  constructor(store) {
    this.store = store;
  }

  findConnected(connected) {
    return this.store.findByKey(connected);
  }

  insertOne(user) {
    return this.store.insertOne(user);
  }

  replaceOne(user) {
    return this.store.replaceOne(user);
  }

  sanitize(user) {
    return {
      _id: user._id,
      created: user.created,
      updated: user.updated,
      displayName: user.displayName,
      fullName: user.fullName,
      status: user.status,
      emails: user.emails,
      emailDomains: user.emailDomains,
      accounts: user.accounts.map(account => ({
        provider: account.provider,
        accountId: account.accountId,
        name: account.name,
        status: account.status,
        profile: account.profile
      }))
    };
  }

  findOneByAccountOrEmails({
    accountId,
    emails,
    provider
  }) {
    let query = {
      'accounts.provider': provider,
      'accounts.accountId': accountId
    };

    if (emails && emails.length !== 0) {
      query = {
        $or: [query, {
          emails: {
            $in: emails
          }
        }]
      };
    }

    return this.store.findOne(query);
  }

  updateAccount(user, account) {
    const accountIndex = user.accounts.indexOf(account);

    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, {
      $set: {
        [`accounts.${accountIndex}`]: account
      }
    });
  }

}
MongoUsersManager.STATUSES = {
  VALIDATED: 'validated',
  DELETED: 'deleted'
};

const COOKIE_NAME = 'connectedUser';
const logger$2 = new Logger('alp:auth');
const signPromisified = promisify(sign);
const verifyPromisified = promisify(verify);
function init({
  usersManager,
  strategies,
  homeRouterKey
}) {
  return (app, options) => {
    const userAccountsService = new UserAccountsService(usersManager);
    const authenticationService = new AuthenticationService(app.config, strategies, userAccountsService);
    const controller = createAuthController({
      usersManager,
      authenticationService,
      homeRouterKey
    });

    app.context.setConnected = async function (connected, user) {
      logger$2.debug('setConnected', {
        connected
      });

      if (!connected) {
        throw new Error('Illegal value for setConnected');
      }

      this.state.connected = connected;
      this.state.user = user;
      const token = await signPromisified({
        connected,
        time: Date.now()
      }, this.config.get('authentication').get('secretKey'), {
        algorithm: 'HS512',
        audience: this.request.headers['user-agent'],
        expiresIn: '30 days'
      });
      this.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: this.config.get('allowHttps')
      });
    };

    app.context.logout = function () {
      delete this.state.connected;
      delete this.state.user;
      this.cookies.set(COOKIE_NAME, '', {
        expires: new Date(1)
      });
    };

    const decodeJwt = async (token, userAgent) => {
      const result = await verifyPromisified(token, app.config.get('authentication').get('secretKey'), {
        algorithm: 'HS512',
        audience: userAgent
      });
      return result && result.connected;
    };

    if (app.websocket) {
      logger$2.debug('app has websocket'); // eslint-disable-next-line global-require, typescript/no-var-requires

      const Cookies = require('cookies');

      const users = new Map();
      app.websocket.users = users;
      app.websocket.use(async (socket, next) => {
        const handshakeData = socket.request;
        const cookies = new Cookies(handshakeData, null, { ...options,
          secure: true
        });
        const token = cookies.get(COOKIE_NAME);
        logger$2.debug('middleware websocket', {
          token
        });
        if (!token) return next();
        let connected;

        try {
          connected = await decodeJwt(token, handshakeData.headers['user-agent']);
        } catch (err) {
          logger$2.info('failed to verify authentication', {
            err
          });
          return next();
        }

        logger$2.debug('middleware websocket', {
          connected
        });
        if (!connected) return next();
        const user = await usersManager.findConnected(connected);
        if (!user) return next();
        socket.user = user;
        users.set(socket.client.id, user);
        socket.on('disconnected', () => users.delete(socket.client.id));
        await next();
      });
    }

    return {
      routes: {
        login: ['/login/:strategy', segment => {
          segment.add('/response', controller.loginResponse, 'loginResponse');
          segment.defaultRoute(controller.login, 'login');
        }],
        logout: ['/logout', controller.logout]
      },
      middleware: async (ctx, next) => {
        const token = ctx.cookies.get(COOKIE_NAME);
        logger$2.debug('middleware', {
          token
        });

        const setState = (connected, user) => {
          ctx.state.connected = connected;
          ctx.state.user = user;
          ctx.sanitizedState.connected = connected;
          ctx.sanitizedState.user = user && usersManager.sanitize(user);
        };

        const notConnected = () => {
          setState(null, null);
          return next();
        };

        if (!token) return notConnected();
        let connected;

        try {
          connected = await decodeJwt(token, ctx.request.headers['user-agent']);
        } catch (err) {
          logger$2.info('failed to verify authentification', {
            err
          });
          ctx.cookies.set(COOKIE_NAME, '', {
            expires: new Date(1)
          });
          return notConnected();
        }

        logger$2.debug('middleware', {
          connected
        });
        if (!connected) return notConnected();
        const user = await usersManager.findConnected(connected);

        if (!user) {
          ctx.cookies.set(COOKIE_NAME, '', {
            expires: new Date(1)
          });
          return notConnected();
        }

        setState(connected, user);
        return next();
      }
    };
  };
}

export default init;
export { MongoUsersManager };
//# sourceMappingURL=index-node10.es.js.map
