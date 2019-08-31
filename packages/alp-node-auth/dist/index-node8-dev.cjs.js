'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const util = require('util');
const jsonwebtoken = require('jsonwebtoken');
const Logger = _interopDefault(require('nightingale-logger'));
const EventEmitter = _interopDefault(require('events'));
const crypto = require('crypto');
const Cookies = _interopDefault(require('cookies'));

const randomBytesPromisified = util.promisify(crypto.randomBytes);
async function randomHex(size) {
  const buffer = await randomBytesPromisified(size);
  return buffer.toString('hex');
}

/* eslint-disable camelcase, max-lines, @typescript-eslint/camelcase */
const logger = new Logger('alp:auth:authentication');
class AuthenticationService extends EventEmitter {
  constructor(config, strategies, userAccountsService) {
    super();
    this.config = config;
    this.strategies = strategies;
    this.userAccountsService = userAccountsService;
  }

  generateAuthUrl(strategy, params) {
    logger.debug('generateAuthUrl', {
      strategy,
      params
    });
    const strategyInstance = this.strategies[strategy];

    switch (strategyInstance.type) {
      case 'oauth2':
        return strategyInstance.oauth2.authorizationCode.authorizeURL(params);

      default:
        throw new Error('Invalid strategy');
    }
  }

  async getTokens(strategy, options) {
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

  async redirectAuthUrl(ctx, strategy, {
    refreshToken,
    scopeKey,
    user,
    accountId
  }, params) {
    logger.debug('redirectAuthUrl', {
      strategy,
      scopeKey,
      refreshToken
    });
    const state = await randomHex(8);
    const scope = this.userAccountsService.getScope(strategy, scopeKey || 'login', user, accountId);

    if (!scope) {
      throw new Error('Invalid empty scope');
    }

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
      redirect_uri: this.redirectUri(ctx, strategy),
      scope,
      state,
      access_type: refreshToken ? 'offline' : 'online',
      ...params
    });
    return ctx.redirect(redirectUri);
  }

  async accessResponse(ctx, strategy, isConnected, hooks) {
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
      const user = await this.userAccountsService.findOrCreateFromStrategy(strategy, tokens, cookie.scope, cookie.scopeKey);

      if (hooks.afterLoginSuccess) {
        await hooks.afterLoginSuccess(strategy, user);
      }

      return user;
    }

    const connectedUser = ctx.state.user;
    const {
      account,
      user
    } = await this.userAccountsService.update(connectedUser, strategy, tokens, cookie.scope, cookie.scopeKey);

    if (hooks.afterScopeUpdate) {
      await hooks.afterScopeUpdate(strategy, cookie.scopeKey, account, user);
    }

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

const logger$1 = new Logger('alp:auth:userAccounts');
const STATUSES = {
  VALIDATED: 'validated',
  DELETED: 'deleted'
};
class UserAccountsService extends EventEmitter {
  constructor(usersManager, strategyToService) {
    super();
    this.usersManager = usersManager;
    this.strategyToService = strategyToService;
  }

  getScope(strategy, scopeKey, user, accountId) {
    logger$1.debug('getScope', {
      strategy,
      userId: user && user._id
    });
    const service = this.strategyToService[strategy];

    if (!service) {
      throw new Error('Strategy not supported');
    }

    const newScope = service.scopeKeyToScope[scopeKey];

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
    const service = this.strategyToService[strategy];
    const profile = await service.getProfile(tokens);
    const accountId = service.getId(profile);
    const account = user.accounts.find(account => account.provider === strategy && account.accountId === accountId);

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

    if (subservice && !account.subservices.includes(subservice)) {
      account.subservices.push(subservice);
    }

    await this.usersManager.replaceOne(user);
    return {
      user,
      account
    };
  }

  async findOrCreateFromStrategy(strategy, tokens, scope, subservice) {
    const service = this.strategyToService[strategy];
    if (!service) throw new Error('Strategy not supported');
    const profile = await service.getProfile(tokens);
    const accountId = service.getId(profile);
    if (!accountId) throw new Error('Invalid profile: no id found');
    const emails = service.getEmails(profile);
    let user = await this.usersManager.findOneByAccountOrEmails({
      provider: service.providerKey,
      accountId,
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
      status: STATUSES.VALIDATED
    });
    if (!user.accounts) user.accounts = [];
    let account = user.accounts.find(account => account.provider === strategy && account.accountId === accountId);

    if (!account) {
      account = {
        provider: strategy,
        accountId
      }; // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore

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

    if (user[keyPath]) {
      await this.usersManager.replaceOne(user);
    } else {
      await this.usersManager.insertOne(user);
    }

    return user;
  }

  async updateAccount(user, account) {
    await this.usersManager.updateAccount(user, account);
    return user;
  }

}

function createAuthController({
  usersManager,
  authenticationService,
  homeRouterKey = '/',
  defaultStrategy,
  authHooks = {}
}) {
  return {
    async login(ctx) {
      const strategy = ctx.namedParam('strategy') || defaultStrategy;
      if (!strategy) throw new Error('Strategy missing');
      const params = authHooks.paramsForLogin && (await authHooks.paramsForLogin(strategy, ctx)) || {};
      await authenticationService.redirectAuthUrl(ctx, strategy, {}, params);
    },

    async addScope(ctx) {
      if (ctx.state.connected) {
        ctx.redirect(ctx.urlGenerator(homeRouterKey));
      }

      const strategy = ctx.namedParam('strategy') || defaultStrategy;
      if (!strategy) throw new Error('Strategy missing');
      const scopeKey = ctx.namedParam('scopeKey');
      if (!scopeKey) throw new Error('Scope missing');
      await authenticationService.redirectAuthUrl(ctx, strategy, {
        scopeKey
      });
    },

    async loginResponse(ctx) {
      if (ctx.state.connected) {
        ctx.redirect(ctx.urlGenerator(homeRouterKey));
      }

      const strategy = ctx.namedParam('strategy');
      ctx.assert(strategy);
      const connectedUser = await authenticationService.accessResponse(ctx, strategy, ctx.state.connected, {
        afterLoginSuccess: authHooks.afterLoginSuccess,
        afterScopeUpdate: authHooks.afterScopeUpdate
      });
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

const createRoutes = controller => ({
  login: ['/login/:strategy?', segment => {
    segment.add('/response', controller.loginResponse, 'loginResponse');
    segment.defaultRoute(controller.login, 'login');
  }],
  addScope: ['/auth/add-scope/:strategy/:scopeKey', controller.addScope],
  logout: ['/logout', controller.logout]
});

const verifyPromisified = util.promisify(jsonwebtoken.verify);
const createDecodeJWT = secretKey => async (token, userAgent) => {
  const result = await verifyPromisified(token, secretKey, {
    algorithm: 'HS512',
    audience: userAgent
  });
  return result && result.connected;
};

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
    return this.sanitizeBaseUser(user);
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

  sanitizeBaseUser(user) {
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

}

/* global fetch */
class UserAccountGoogleService {
  constructor(scopeKeyToScope) {
    this.providerKey = 'google';
    this.scopeKeyToScope = { ...scopeKeyToScope,
      login: 'openid profile email'
    };
  }

  getProfile(tokens) {
    return fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokens.accessToken}`).then(response => response.json());
  }

  getId(profile) {
    return profile.id;
  }

  getAccountName(profile) {
    return profile.email;
  }

  getEmails(profile) {
    const emails = [];

    if (profile.email) {
      emails.push(profile.email);
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

}

/* global fetch */
// https://api.slack.com/methods/users.identity
class UserAccountSlackService {
  constructor(scopeKeyToScope) {
    this.providerKey = 'google';
    this.scopeKeyToScope = { ...scopeKeyToScope,
      login: 'identity.basic identity.email identity.avatar'
    };
  }

  getProfile(tokens) {
    return fetch(`https://slack.com/api/users.identity?token=${tokens.accessToken}`).then(response => response.json());
  }

  getId(profile) {
    if (!profile || !profile.team || !profile.team.id || !profile.user || !profile.user.id) {
      return null;
    }

    return `team:${profile.team.id};user:${profile.user.id}`;
  }

  getAccountName(profile) {
    return profile.user.email;
  }

  getEmails(profile) {
    return [profile.user.email];
  }

  getDisplayName(profile) {
    return profile.user.name;
  }

  getFullName(profile) {
    return null;
  }

  getDefaultScope(newScope) {
    return this.getScope(undefined, newScope);
  }

  getScope(oldScope, newScope) {
    return !oldScope ? newScope.split(' ') : oldScope.concat(newScope.split(' ')).filter((item, i, ar) => ar.indexOf(item) === i);
  }

}

const COOKIE_NAME = 'connectedUser';
const logger$2 = new Logger('alp:auth');
const authSocketIO = (app, usersManager, io, options) => {
  const decodeJwt = createDecodeJWT(app.config.get('authentication').get('secretKey'));
  const users = new Map();
  io.users = users;
  io.use(async (socket, next) => {
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
};

const COOKIE_NAME$1 = 'connectedUser';
const logger$3 = new Logger('alp:auth');
const signPromisified = util.promisify(jsonwebtoken.sign);
function init({
  homeRouterKey,
  usersManager,
  strategies,
  defaultStrategy,
  strategyToService,
  authHooks
}) {
  return app => {
    const userAccountsService = new UserAccountsService(usersManager, strategyToService);
    const authenticationService = new AuthenticationService(app.config, strategies, userAccountsService);
    const controller = createAuthController({
      usersManager,
      authenticationService,
      homeRouterKey,
      defaultStrategy,
      authHooks
    });

    app.context.setConnected = async function (connected, user) {
      logger$3.debug('setConnected', {
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
      this.cookies.set(COOKIE_NAME$1, token, {
        httpOnly: true,
        secure: this.config.get('allowHttps')
      });
    };

    app.context.logout = function () {
      delete this.state.connected;
      delete this.state.user;
      this.cookies.set(COOKIE_NAME$1, '', {
        expires: new Date(1)
      });
    };

    const decodeJwt = createDecodeJWT(app.config.get('authentication').get('secretKey'));
    return {
      routes: createRoutes(controller),
      middleware: async (ctx, next) => {
        const token = ctx.cookies.get(COOKIE_NAME$1);
        logger$3.debug('middleware', {
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
          logger$3.info('failed to verify authentification', {
            err
          });
          ctx.cookies.set(COOKIE_NAME$1, '', {
            expires: new Date(1)
          });
          return notConnected();
        }

        logger$3.debug('middleware', {
          connected
        });
        if (!connected) return notConnected();
        const user = await usersManager.findConnected(connected);

        if (!user) {
          ctx.cookies.set(COOKIE_NAME$1, '', {
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

exports.AuthenticationService = AuthenticationService;
exports.MongoUsersManager = MongoUsersManager;
exports.STATUSES = STATUSES;
exports.UserAccountGoogleService = UserAccountGoogleService;
exports.UserAccountSlackService = UserAccountSlackService;
exports.authSocketIO = authSocketIO;
exports.default = init;
//# sourceMappingURL=index-node8-dev.cjs.js.map
