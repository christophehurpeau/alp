'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var t = _interopDefault(require('flow-runtime'));
var crypto = require('crypto');
var util = require('util');
var EventEmitter = _interopDefault(require('events'));
var Logger = _interopDefault(require('nightingale-logger'));
var jsonwebtoken = require('jsonwebtoken');

const UserNameType = t.type("UserNameType", t.object(t.property("familyName", t.string()), t.property("givenName", t.string())));

const AccountType = t.type("AccountType", t.object(t.property("accessToken", t.string()), t.property("accountId", t.string()), t.property("name", t.string()), t.property("profile", t.object(), true), t.property("provider", t.string()), t.property("refreshToken", t.string(), true), t.property("scope", t.array(t.string())), t.property("status", t.string()), t.property("tokenExpireDate", t.ref("Date"))));

const UserType = t.type("UserType", t.object(t.property("_id", t.string(), true), t.property("accounts", t.array(AccountType)), t.property("displayName", t.string()), t.property("emailDomains", t.array(t.string())), t.property("emails", t.array(t.string())), t.property("fullName", UserNameType), t.property("id", t.string(), true), t.property("status", t.string())));

const AccountBrowserType = t.type("AccountBrowserType", t.object(t.property("accountId", t.string()), t.property("name", t.string()), t.property("provider", t.string()), t.property("status", t.string())));

const UserBrowserType = t.type("UserBrowserType", t.object(t.property("_id", t.string(), true), t.property("accounts", t.array(AccountBrowserType)), t.property("displayName", t.string()), t.property("emailDomains", t.array(t.string())), t.property("emails", t.array(t.string())), t.property("fullName", UserNameType), t.property("id", t.string(), true), t.property("status", t.string())));

const UserType$1 = t.tdz(() => UserType);
const UserBrowserType$1 = t.tdz(() => UserBrowserType);
var abstractUsersManager = {
  STATUSES: {
    VALIDATED: 'validated',
    DELETED: 'deleted'
  },

  findOneByAccountOrEmails(_arg) {
    t.return(t.nullable(t.ref(UserType$1)));
    let {
      provider,
      accountId,
      emails
    } = t.object(t.property('accountId', t.union(t.string(), t.number())), t.property('emails', t.nullable(t.array(t.string()))), t.property('provider', t.string())).assert(_arg);

    throw new Error('Not implemented');
  },

  findConnected(connected) {
    const _returnType2 = t.return(t.nullable(t.ref(UserType$1)));

    return this.store.findByKey(connected).then(_arg2 => _returnType2.assert(_arg2));
  },

  insertOne(user) {
    const _returnType3 = t.return(t.any());

    return this.store.insertOne(user).then(_arg3 => _returnType3.assert(_arg3));
  },

  updateOne(user) {
    const _returnType4 = t.return(t.any());

    return this.store.updateOne(user).then(_arg4 => _returnType4.assert(_arg4));
  },

  transformForBrowser(user) {
    const _returnType5 = t.return(t.ref(UserBrowserType$1));

    return _returnType5.assert({
      id: user.id,
      _id: user._id,
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
    });
  }
};

const UserType$2 = t.tdz(() => UserType);
const AccountType$1 = t.tdz(() => AccountType);
const mongoUsersManager = Object.create(abstractUsersManager);

Object.assign(mongoUsersManager, {
  findOneByAccountOrEmails(_arg) {
    const _returnType = t.return(t.nullable(t.ref(UserType$2)));

    let {
      accountId,
      emails,
      provider
    } = t.object(t.property('accountId', t.union(t.string(), t.number())), t.property('emails', t.nullable(t.array(t.string())), true), t.property('provider', t.string())).assert(_arg);

    let query = {
      'accounts.provider': provider,
      'accounts.accountId': accountId
    };

    if (emails && emails.length) {
      query = {
        $or: [query, {
          emails: { $in: emails }
        }]
      };
    }

    return this.store.findOne(query).then(_arg2 => _returnType.assert(_arg2));
  },

  updateAccount(user, account) {
    let _userType = t.ref(UserType$2);

    let _accountType = t.ref(AccountType$1);

    t.param('user', _userType).assert(user);
    t.param('account', _accountType).assert(account);

    const accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, { [`accounts.${accountIndex}`]: account });
  }
});

const UserType$3 = t.tdz(() => UserType);
const AccountType$2 = t.tdz(() => AccountType);
const mongoUsersManager$1 = Object.create(abstractUsersManager);

Object.assign(mongoUsersManager$1, {
  findOneByAccountOrEmails(_arg) {
    const _returnType = t.return(t.nullable(t.ref(UserType$3)));

    let {
      accountId,
      emails,
      provider
    } = t.object(t.property('accountId', t.union(t.string(), t.number())), t.property('emails', t.nullable(t.array(t.string()))), t.property('provider', t.string())).assert(_arg);

    const r = this.store.r;
    let filter = r.row('accounts').contains(row => r.and(row('provider').eq(provider), row('accountId').eq(accountId)));

    if (emails && emails.length) {
      filter = r.or(filter, r.row('emails').contains(row => r.expr(emails).contains(row)));
    }

    const query = this.store.query().filter(filter);
    return this.store.findOne(query).then(_arg2 => _returnType.assert(_arg2));
  },

  updateAccount(user, account) {
    let _userType = t.ref(UserType$3);

    let _accountType = t.ref(AccountType$2);

    t.param('user', _userType).assert(user);
    t.param('account', _accountType).assert(account);

    const accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, {
      accounts: this.store.r.row('accounts').changeAt(accountIndex, account)
    });
  }
});

const randomBytesPromisified = util.promisify(crypto.randomBytes);

function randomHex(size) {
  let _sizeType2 = t.number();

  const _returnType2 = t.return(t.string());

  t.param('size', _sizeType2).assert(size);

  return randomBytesPromisified(size).then(buffer => buffer.toString('hex')).then(_arg2 => _returnType2.assert(_arg2));
}

var _class, _temp2;

var userAccountGoogleService = new (_temp2 = _class = class extends EventEmitter {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.providerKey = 'google', _temp;
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
    return this.getScope(newScope);
  }

  getScope(oldScope, newScope) {
    return !oldScope ? newScope.split(' ') : oldScope.concat(newScope.split(' ')).filter((item, i, ar) => ar.indexOf(item) === i);
  }
}, _class.scopeKeyToScope = {
  login: 'openid profile email https://www.googleapis.com/auth/plus.profile.emails.read'
}, _temp2)();

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var _class$1, _temp;
const TokensObject = t.type('TokensObject', t.object(t.property('accessToken', t.string()), t.property('expireDate', t.ref('Date')), t.property('idToken', t.string()), t.property('refreshToken', t.string(), true), t.property('tokenType', t.string())));


const logger = new Logger('alp:auth:userAccounts');

let UserAccountsService = (_temp = _class$1 = class extends EventEmitter {

  constructor(usersManager) {
    super();
    this.usersManager = usersManager;
  }

  getScope(strategy, scopeKey, user, accountId) {
    let _strategyType = t.string();

    let _scopeKeyType = t.string();

    t.param('strategy', _strategyType).assert(strategy);
    t.param('scopeKey', _scopeKeyType).assert(scopeKey);

    logger.debug('getScope', { strategy, userId: user && user._id });
    const service = this.constructor.strategyToService[strategy];
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

  update(user, strategy, tokens, scope, subservice) {
    var _this = this;

    return asyncToGenerator(function* () {
      const service = _this.constructor.strategyToService[strategy];
      const profile = yield service.getProfile(tokens);
      const account = user.accounts.find(function (account) {
        return account.provider === strategy && service.isAccount(account, profile);
      });
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

      yield _this.usersManager.update(user);
      return user;
    })();
  }

  findOrCreateFromGoogle(strategy, tokens, scope, subservice) {
    var _this2 = this;

    return asyncToGenerator(function* () {
      let _strategyType2 = t.string();

      let _scopeType = t.string();

      t.param('strategy', _strategyType2).assert(strategy);
      t.param('tokens', TokensObject).assert(tokens);
      t.param('scope', _scopeType).assert(scope);

      if (strategy !== 'google') {
        throw new Error('Not supported at the moment');
      }

      const service = _this2.constructor.strategyToService[strategy];

      const profile = yield service.getProfile(tokens);

      const plusProfile = yield fetch(`https://www.googleapis.com/plus/v1/people/me?access_token=${tokens.accessToken}`).then(function (response) {
        return response.json();
      });

      const emails = service.getEmails(profile, plusProfile);

      let user = yield _this2.usersManager.findOneByAccountOrEmails({
        provider: service.providerKey,
        accountId: service.getId(profile),
        emails
      });

      logger.info(!user ? 'create user' : 'existing user', { emails, user });

      if (!user) {
        user = {};
      }

      Object.assign(user, {
        displayName: service.getDisplayName(profile),
        fullName: service.getFullName(profile),
        status: _this2.usersManager.STATUSES.VALIDATED
      });

      if (!user.accounts) user.accounts = [];

      const accountId = service.getId(profile);

      let account = user.accounts.find(function (account) {
        return account.provider === strategy && account.accountId === accountId;
      });

      if (!account) {
        account = { provider: strategy, accountId };
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
      emails.forEach(function (email) {
        if (!userEmails.includes(email)) {
          userEmails.push(email);
        }
      });

      user.emailDomains = Array.from(user.emails.reduce(function (domains, email) {
        return domains.add(email.split('@', 2)[1]);
      }, new Set()));

      const keyPath = t.string().assert(_this2.usersManager.store.keyPath);
      yield _this2.usersManager[user[keyPath] ? 'updateOne' : 'insertOne'](user);
      return user;
    })();
  }

  updateAccount(user, account) {
    return this.usersManager.updateAccount(user, account).then(() => user);
  }
}, _class$1.strategyToService = {
  google: userAccountGoogleService
}, _temp);

/* eslint camelcase: 'off', max-lines: 'off' */
const logger$1 = new Logger('alp:auth:authentication');

const GenerateAuthUrlOptionsType = t.type('GenerateAuthUrlOptionsType', t.object(t.property('accessType', t.string(), true), t.property('grantType', t.string(), true), t.property('includeGrantedScopes', t.boolean(), true), t.property('loginHint', t.string(), true), t.property('prompt', t.string(), true), t.property('redirectUri', t.string(), true), t.property('scope', t.string(), true), t.property('state', t.string(), true)));
const GetTokensOptionsType = t.type('GetTokensOptionsType', t.object(t.property('code', t.string()), t.property('redirectUri', t.string())));
let AuthenticationService = class extends EventEmitter {

  constructor(config, strategies, userAccountsService) {
    let _strategiesType = t.object();

    let _userAccountsServiceType = t.ref(UserAccountsService);

    t.param('strategies', _strategiesType).assert(strategies);
    t.param('userAccountsService', _userAccountsServiceType).assert(userAccountsService);

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
    let _strategyType = t.string();

    t.param('strategy', _strategyType).assert(strategy);
    t.param('options', GenerateAuthUrlOptionsType).assert(options);

    logger$1.debug('generateAuthUrl', { strategy, options });
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

  getTokens(strategy, options = {}) {
    let _strategyType2 = t.string();

    t.param('strategy', _strategyType2).assert(strategy);
    t.param('options', GetTokensOptionsType).assert(options);

    logger$1.debug('getTokens', { strategy, options });
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case 'oauth2':
        return strategyInstance.oauth2.authorizationCode.getToken({
          code: options.code,
          redirect_uri: options.redirectUri
        }).then(result => result && {
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
        }
        // return strategyInstance.accessToken.create(result);
        );
    }
  }

  refreshToken(strategy, tokens) {
    let _strategyType3 = t.string();

    t.param('strategy', _strategyType3).assert(strategy);

    logger$1.debug('refreshToken', { strategy });
    if (!tokens.refreshToken) {
      throw new Error('Missing refresh token');
    }
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case 'oauth2':
        {
          const token = strategyInstance.oauth2.accessToken.create({
            refresh_token: tokens.refreshToken
          });
          return token.refresh().then(result => {
            const tokens = result.token;
            return result && {
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
          });
        }
    }
  }

  redirectUri(ctx, strategy) {
    let _strategyType4 = t.string();

    t.param('strategy', _strategyType4).assert(strategy);

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
  redirectAuthUrl(ctx, strategy, refreshToken, scopeKey, user, accountId) {
    var _this = this;

    return asyncToGenerator(function* () {
      let _ctxType = t.object();

      let _strategyType5 = t.string();

      let _refreshTokenType = t.nullable(t.string());

      let _scopeKeyType = t.nullable(t.string());

      t.param('ctx', _ctxType).assert(ctx);
      t.param('strategy', _strategyType5).assert(strategy);
      t.param('refreshToken', _refreshTokenType).assert(refreshToken);
      t.param('scopeKey', _scopeKeyType).assert(scopeKey);

      logger$1.debug('redirectAuthUrl', { strategy, scopeKey, refreshToken });
      const state = yield randomHex(8);

      const scope = _this.userAccountsService.getScope(strategy, scopeKey || 'login', user, accountId);

      ctx.cookies.set(`auth_${strategy}_${state}`, JSON.stringify({
        scopeKey,
        scope,
        isLoginAccess: !scopeKey || scopeKey === 'login'
      }), {
        maxAge: 600000,
        httpOnly: true,
        secure: _this.config.get('allowHttps')
      });
      const redirectUri = _this.generateAuthUrl(strategy, {
        redirectUri: _this.redirectUri(ctx, strategy),
        scope,
        state,
        accessType: refreshToken ? 'offline' : 'online'
      });

      return ctx.redirect(redirectUri);
    })();
  }

  /**
   * @param {Koa.Context} ctx
   * @param {string} strategy
   * @param {boolean} isConnected
   * @returns {*}
   */
  accessResponse(ctx, strategy, isConnected) {
    var _this2 = this;

    return asyncToGenerator(function* () {
      let _strategyType6 = t.string();

      let _isConnectedType = t.nullable(t.boolean());

      t.param('strategy', _strategyType6).assert(strategy);
      t.param('isConnected', _isConnectedType).assert(isConnected);

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

      const tokens = yield _this2.getTokens(strategy, {
        code,
        redirectUri: _this2.redirectUri(ctx, strategy)
      });

      if (cookie.isLoginAccess) {
        const user = yield _this2.userAccountsService.findOrCreateFromGoogle(strategy, tokens, cookie.scope, cookie.scopeKey);
        return user;
      }

      ctx.cookies.set(cookieName, '', { expires: new Date(1) });
      const connectedUser = ctx.state.connected;
      yield _this2.userAccountsService.update(connectedUser, strategy, tokens, cookie.scope, cookie.scopeKey);
      return connectedUser;
    })();
  }

  refreshAccountTokens(user, account) {
    if (account.tokenExpireDate && account.tokenExpireDate.getTime() > Date.now()) {
      return Promise.resolve(false);
    }
    return this.refreshToken(account.provider, {
      accessToken: account.accessToken,
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
};

function createAuthController(_arg) {
  let {
    usersManager,
    authenticationService,
    homeRouterKey = '/'
  } = t.object(t.property('authenticationService', t.ref(AuthenticationService)), t.property('homeRouterKey', t.nullable(t.string()), true), t.property('usersManager', t.object())).assert(_arg);

  return {
    login(ctx) {
      return asyncToGenerator(function* () {
        const strategy = ctx.namedParam('strategy');
        if (!strategy) throw new Error('Strategy missing');
        yield authenticationService.redirectAuthUrl(ctx, strategy);
      })();
    },

    loginResponse(ctx) {
      return asyncToGenerator(function* () {
        if (ctx.state.connected) {
          ctx.redirect(ctx.urlGenerator(homeRouterKey));
        }

        const strategy = ctx.namedParam('strategy');
        ctx.assert(strategy);

        const connectedUser = yield authenticationService.accessResponse(ctx, strategy);
        const keyPath = t.string().assert(usersManager.store.keyPath);
        yield ctx.setConnected(connectedUser[keyPath], connectedUser);
        ctx.state.connected = connectedUser;
        yield ctx.redirect(ctx.urlGenerator(homeRouterKey));
      })();
    },

    logout(ctx) {
      return asyncToGenerator(function* () {
        ctx.logout();
        yield ctx.redirect(ctx.urlGenerator(homeRouterKey));
      })();
    }
  };
}

const COOKIE_NAME = 'connectedUser';
const logger$2 = new Logger('alp:auth');

const signPromisified = util.promisify(jsonwebtoken.sign);
const verifyPromisified = util.promisify(jsonwebtoken.verify);

function init(_arg) {
  let {
    usersManager,
    strategies,
    homeRouterKey
  } = t.object(t.property('homeRouterKey', t.nullable(t.string()), true), t.property('strategies', t.object()), t.property('usersManager', t.object())).assert(_arg);

  return app => {
    const userAccountsService = new UserAccountsService(usersManager);

    const authenticationService = new AuthenticationService(app.config, strategies, userAccountsService);

    const controller = createAuthController({
      usersManager,
      authenticationService,
      homeRouterKey
    });

    app.reduxReducers.user = (state = null) => state;
    app.reduxReducers.connected = (state = null) => state;

    app.context.setConnected = (() => {
      var _ref = asyncToGenerator(function* (connected, user) {
        let _connectedType = t.union(t.number(), t.string());

        let _userType = t.object();

        t.param('connected', _connectedType).assert(connected);
        t.param('user', _userType).assert(user);

        logger$2.debug('setConnected', { connected });
        if (!connected) {
          throw new Error('Illegal value for setConnected');
        }

        this.state.connected = connected;
        this.state.user = user;

        const token = yield signPromisified({ connected, time: Date.now() }, this.config.get('authentication').get('secretKey'), {
          algorithm: 'HS512',
          audience: this.request.headers['user-agent'],
          expiresIn: '30 days'
        });

        this.cookies.set(COOKIE_NAME, token, {
          httpOnly: true,
          secure: this.config.get('allowHttps')
        });
      });

      return function () {
        return _ref.apply(this, arguments);
      };
    })();

    app.context.logout = function () {
      delete this.state.connected;
      delete this.state.user;
      this.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
    };

    const decodeJwt = (() => {
      var _ref2 = asyncToGenerator(function* (token, userAgent) {
        const result = yield verifyPromisified(token, app.config.get('authentication').get('secretKey'), {
          algorithm: 'HS512',
          audience: userAgent
        });
        return result && result.connected;
      });

      return function decodeJwt() {
        return _ref2.apply(this, arguments);
      };
    })();

    if (app.websocket) {
      logger$2.debug('app has websocket');
      // eslint-disable-next-line global-require
      const Cookies = require('cookies');

      const users = new Map();
      app.websocket.users = users;

      app.websocket.use((() => {
        var _ref3 = asyncToGenerator(function* (socket, next) {
          const handshakeData = socket.request;
          const cookies = new Cookies(handshakeData, null, { keys: app.keys });
          const token = cookies.get(COOKIE_NAME);
          logger$2.debug('middleware websocket', { token });

          if (!token) return next();

          let connected;
          try {
            connected = yield decodeJwt(token, handshakeData.headers['user-agent']);
          } catch (err) {
            logger$2.info('failed to verify authentication', { err });
            return next();
          }
          logger$2.debug('middleware websocket', { connected });

          if (!connected) return next();

          const user = yield usersManager.findConnected(connected);

          if (!user) return next();

          socket.user = user;
          users.set(socket.client.id, user);

          socket.on('disconnected', function () {
            return users.delete(socket.client.id);
          });

          yield next();
        });

        return function () {
          return _ref3.apply(this, arguments);
        };
      })());
    }

    return {
      routes: {
        login: ['/login/:strategy', segment => {
          segment.add('/response', controller.loginResponse, 'loginResponse');
          segment.defaultRoute(controller.login, 'login');
        }],
        logout: ['/logout', controller.logout]
      },

      middleware: (() => {
        var _ref4 = asyncToGenerator(function* (ctx, next) {
          const token = ctx.cookies.get(COOKIE_NAME);
          logger$2.debug('middleware', { token });

          const setState = function (connected, user) {
            ctx.state.connected = connected;
            ctx.state.user = user;
            if (ctx.reduxInitialContext) {
              ctx.reduxInitialContext.connected = connected;
              ctx.reduxInitialContext.user = user && usersManager.transformForBrowser(user);
            }
          };

          const notConnected = function () {
            setState(null, null);
            return next();
          };

          if (!token) return notConnected();

          let connected;
          try {
            connected = yield decodeJwt(token, ctx.request.headers['user-agent']);
          } catch (err) {
            logger$2.info('failed to verify authentification', { err });
            ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
            return notConnected();
          }
          logger$2.debug('middleware', { connected });

          if (!connected) return notConnected();

          const user = yield usersManager.findConnected(connected);

          if (!user) {
            ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
            return notConnected();
          }

          setState(connected, user);
          return next();
        });

        return function middleware() {
          return _ref4.apply(this, arguments);
        };
      })()
    };
  };
}

exports.abstractUsersManager = abstractUsersManager;
exports.mongoUsersManager = mongoUsersManager;
exports.rethinkUsersManager = mongoUsersManager$1;
exports.default = init;
exports.UserNameType = UserNameType;
exports.AccountType = AccountType;
exports.UserType = UserType;
exports.AccountBrowserType = AccountBrowserType;
exports.UserBrowserType = UserBrowserType;
//# sourceMappingURL=index-node6-dev.cjs.js.map
