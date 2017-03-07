'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _dec, _dec2, _dec3, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3; /* eslint camelcase: 'off', max-lines: 'off' */


var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _promiseCallbackFactory = require('promise-callback-factory');

var _promiseCallbackFactory2 = _interopRequireDefault(_promiseCallbackFactory);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _UserAccountsService = require('./user/UserAccountsService');

var _UserAccountsService2 = _interopRequireDefault(_UserAccountsService);

var _generators = require('../utils/generators');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['defineProperty'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

const logger = new _nightingaleLogger2.default('alp:auth:authentication');

const GenerateAuthUrlOptionsType = _flowRuntime2.default.type('GenerateAuthUrlOptionsType', _flowRuntime2.default.object(_flowRuntime2.default.property('redirectUri', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('scope', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('state', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('grantType', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('accessType', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('prompt', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('loginHint', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('includeGrantedScopes', _flowRuntime2.default.boolean(), true)));

const GetTokensOptionsType = _flowRuntime2.default.type('GetTokensOptionsType', _flowRuntime2.default.object(_flowRuntime2.default.property('code', _flowRuntime2.default.string()), _flowRuntime2.default.property('redirectUri', _flowRuntime2.default.string())));

let AuthenticationService = (_dec = _flowRuntime2.default.decorate(_flowRuntime2.default.object()), _dec2 = _flowRuntime2.default.decorate(_flowRuntime2.default.object()), _dec3 = _flowRuntime2.default.decorate(function () {
  return _flowRuntime2.default.ref(_UserAccountsService2.default);
}), (_class = class extends _events2.default {

  constructor(config, strategies, userAccountsService) {
    let _strategiesType = _flowRuntime2.default.object();

    let _userAccountsServiceType = _flowRuntime2.default.ref(_UserAccountsService2.default);

    _flowRuntime2.default.param('strategies', _strategiesType).assert(strategies);

    _flowRuntime2.default.param('userAccountsService', _userAccountsServiceType).assert(userAccountsService);

    super();

    _initDefineProp(this, 'config', _descriptor, this);

    _initDefineProp(this, 'strategies', _descriptor2, this);

    _initDefineProp(this, 'userAccountsService', _descriptor3, this);

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
    let _strategyType = _flowRuntime2.default.string();

    _flowRuntime2.default.param('strategy', _strategyType).assert(strategy);

    _flowRuntime2.default.param('options', GenerateAuthUrlOptionsType).assert(options);

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
          include_granted_scopes: options.includeGrantedScopes
        });
    }
  }

  getTokens(strategy, options = {}) {
    let _strategyType2 = _flowRuntime2.default.string();

    _flowRuntime2.default.param('strategy', _strategyType2).assert(strategy);

    _flowRuntime2.default.param('options', GetTokensOptionsType).assert(options);

    logger.debug('getTokens', { strategy, options });
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case 'oauth2':
        return (0, _promiseCallbackFactory2.default)(done => {
          strategyInstance.oauth2.authorizationCode.getToken({
            code: options.code,
            redirect_uri: options.redirectUri
          }, done);
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
    let _strategyType3 = _flowRuntime2.default.string();

    _flowRuntime2.default.param('strategy', _strategyType3).assert(strategy);

    logger.debug('refreshToken', { strategy });
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
          return (0, _promiseCallbackFactory2.default)(done => token.refresh(done)).then(result => {
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
    let _strategyType4 = _flowRuntime2.default.string();

    _flowRuntime2.default.param('strategy', _strategyType4).assert(strategy);

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
  async redirectAuthUrl(ctx, strategy, refreshToken, scopeKey, user, accountId) {
    let _ctxType = _flowRuntime2.default.object();

    let _strategyType5 = _flowRuntime2.default.string();

    let _refreshTokenType = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

    let _scopeKeyType = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

    _flowRuntime2.default.param('ctx', _ctxType).assert(ctx);

    _flowRuntime2.default.param('strategy', _strategyType5).assert(strategy);

    _flowRuntime2.default.param('refreshToken', _refreshTokenType).assert(refreshToken);

    _flowRuntime2.default.param('scopeKey', _scopeKeyType).assert(scopeKey);

    logger.debug('redirectAuthUrl', { strategy, scopeKey, refreshToken });
    const state = await (0, _generators.randomHex)(8);

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

    return await ctx.redirect(redirectUri);
  }

  /**
   * @param {Koa.Context} ctx
   * @param {string} strategy
   * @param {boolean} isConnected
   * @returns {*}
   */
  async accessResponse(ctx, strategy, isConnected) {
    let _strategyType6 = _flowRuntime2.default.string();

    let _isConnectedType = _flowRuntime2.default.nullable(_flowRuntime2.default.boolean());

    _flowRuntime2.default.param('strategy', _strategyType6).assert(strategy);

    _flowRuntime2.default.param('isConnected', _isConnectedType).assert(isConnected);

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
      redirectUri: this.redirectUri(ctx, strategy)
    });

    if (cookie.isLoginAccess) {
      const user = await this.userAccountsService.findOrCreateFromGoogle(strategy, tokens, cookie.scope, cookie.scopeKey);
      return user;
    }

    ctx.cookies.set(cookieName, '', { expires: new Date(1) });
    const connectedUser = ctx.state.connected;
    await this.userAccountsService.update(connectedUser, strategy, tokens, cookie.scope, cookie.scopeKey);
    return connectedUser;
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
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'config', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'strategies', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'userAccountsService', [_dec3], {
  enumerable: true,
  initializer: null
})), _class));
exports.default = AuthenticationService;
//# sourceMappingURL=AuthenticationService.js.map