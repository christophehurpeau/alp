'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _promiseCallbackFactory = require('promise-callback-factory');

var _promiseCallbackFactory2 = _interopRequireDefault(_promiseCallbackFactory);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _generators = require('../utils/generators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { return void reject(error); } return info.done ? void resolve(value) : Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } return step("next"); }); }; } /* eslint camelcase: 'off', max-lines: 'off' */


const logger = new _nightingaleLogger2.default('alp:auth:authentication');

let AuthenticationService = class extends _events2.default {

  constructor(config, strategies, userAccountsService) {
    super(), this.config = config, this.strategies = strategies, this.userAccountsService = userAccountsService;
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

            return d.setTime(d.getTime() + result.expires_in * 1000), d;
          })(),
          idToken: result.id_token
        }
        // return strategyInstance.accessToken.create(result);
        );
    }
  }

  refreshToken(strategy, tokens) {
    if (logger.debug('refreshToken', { strategy }), !tokens.refreshToken) throw new Error('Missing refresh token');
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

                return d.setTime(d.getTime() + tokens.expires_in * 1000), d;
              })(),
              idToken: tokens.id_token
            };
          });
        }
    }
  }

  redirectUri(ctx, strategy) {
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

    return _asyncToGenerator(function* () {
      logger.debug('redirectAuthUrl', { strategy, scopeKey, refreshToken });

      const state = yield (0, _generators.randomHex)(8);

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

    return _asyncToGenerator(function* () {
      if (ctx.query.error) {
        const error = new Error(ctx.query.error);

        throw error.status = 403, error.expose = true, error;
      }

      const code = ctx.query.code;
      const state = ctx.query.state;
      const cookieName = `auth_${strategy}_${state}`;
      let cookie = ctx.cookies.get(cookieName);

      if (ctx.cookies.set(cookieName, '', { expires: new Date(1) }), !cookie) throw new Error('No cookie for this state');

      if (cookie = JSON.parse(cookie), !cookie || !cookie.scope) throw new Error('Unexpected cookie value');

      if (!cookie.isLoginAccess && !isConnected) throw new Error('You are not connected');

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

      return yield _this2.userAccountsService.update(connectedUser, strategy, tokens, cookie.scope, cookie.scopeKey), connectedUser;
    })();
  }

  refreshAccountTokens(user, account) {
    return account.tokenExpireDate && account.tokenExpireDate.getTime() > Date.now() ? Promise.resolve(false) : this.refreshToken(account.provider, {
      accessToken: account.accessToken,
      refreshToken: account.refreshToken
    }).then(tokens => !!tokens && (account.accessToken = tokens.accessToken, account.tokenExpireDate = tokens.expireDate, this.userAccountsService.updateAccount(user, account).then(() => true)));
  }
};
exports.default = AuthenticationService;
//# sourceMappingURL=AuthenticationService.js.map