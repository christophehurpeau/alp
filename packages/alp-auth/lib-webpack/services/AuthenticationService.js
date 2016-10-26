var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint camelcase: "off" */
import EventEmitter from 'events';
import promiseCallback from 'promise-callback-factory';
import Logger from 'nightingale-logger';

import { randomHex } from '../utils/generators';

var logger = new Logger('alp:auth:authentication');

var AuthenticationService = function (_EventEmitter) {
  _inherits(AuthenticationService, _EventEmitter);

  function AuthenticationService(config, strategies, userAccountsService) {
    _classCallCheck(this, AuthenticationService);

    var _this = _possibleConstructorReturn(this, (AuthenticationService.__proto__ || Object.getPrototypeOf(AuthenticationService)).call(this));

    _this.config = config;
    _this.strategies = strategies;
    _this.userAccountsService = userAccountsService;
    return _this;
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


  _createClass(AuthenticationService, [{
    key: 'generateAuthUrl',
    value: function generateAuthUrl(strategy) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      logger.debug('generateAuthUrl', { strategy: strategy, options: options });
      var strategyInstance = this.strategies[strategy];
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
  }, {
    key: 'getTokens',
    value: function getTokens(strategy) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      logger.debug('getTokens', { strategy: strategy, options: options });
      var strategyInstance = this.strategies[strategy];
      switch (strategyInstance.type) {
        case 'oauth2':
          return promiseCallback(function (done) {
            strategyInstance.oauth2.authorizationCode.getToken({
              code: options.code,
              redirect_uri: options.redirectUri
            }, done);
          }).then(function (result) {
            return result && {
              accessToken: result.access_token,
              refreshToken: result.refresh_token,
              tokenType: result.token_type,
              expiresIn: result.expires_in,
              expireDate: function () {
                var d = new Date();
                d.setTime(d.getTime() + result.expires_in * 1000);
                return d;
              }(),
              idToken: result.id_token
            }
            // return strategyInstance.accessToken.create(result);
            ;
          });
      }
    }
  }, {
    key: 'refreshToken',
    value: function refreshToken(strategy, tokens) {
      logger.debug('refreshToken', { strategy: strategy });
      if (!tokens.refreshToken) {
        throw new Error('Missing refresh token');
      }
      var strategyInstance = this.strategies[strategy];
      switch (strategyInstance.type) {
        case 'oauth2':
          {
            var _ret = function () {
              var token = strategyInstance.oauth2.accessToken.create({
                refresh_token: tokens.refreshToken
              });
              return {
                v: promiseCallback(function (done) {
                  return token.refresh(done);
                }).then(function (result) {
                  var tokens = result.token;
                  return result && {
                    accessToken: tokens.access_token,
                    tokenType: tokens.token_type,
                    expiresIn: tokens.expires_in,
                    expireDate: function () {
                      var d = new Date();
                      d.setTime(d.getTime() + tokens.expires_in * 1000);
                      return d;
                    }(),
                    idToken: tokens.id_token
                  };
                })
              };
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
          }
      }
    }
  }, {
    key: 'redirectUri',
    value: function redirectUri(ctx, strategy) {
      var host = 'http' + (this.config.get('allowHttps') ? 's' : '') + '://' + ctx.request.host;
      return '' + host + ctx.urlGenerator('loginResponse', { strategy: strategy });
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

  }, {
    key: 'redirectAuthUrl',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, strategy, refreshToken, scopeKey, user, accountId) {
        var state, scope, redirectUri;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                logger.debug('redirectAuthUrl', { strategy: strategy, scopeKey: scopeKey, refreshToken: refreshToken });
                _context.next = 3;
                return randomHex(8);

              case 3:
                state = _context.sent;
                scope = this.userAccountsService.getScope(strategy, scopeKey || 'login', user, accountId);


                ctx.cookies.set('auth_' + strategy + '_' + state, JSON.stringify({
                  scopeKey: scopeKey,
                  scope: scope,
                  isLoginAccess: !scopeKey || scopeKey === 'login'
                }), {
                  maxAge: 600000,
                  httpOnly: true,
                  secure: this.config.get('allowHttps')
                });
                redirectUri = this.generateAuthUrl(strategy, {
                  redirectUri: this.redirectUri(ctx, strategy),
                  scope: scope,
                  state: state,
                  accessType: refreshToken ? 'offline' : 'online'
                });
                _context.next = 9;
                return ctx.redirect(redirectUri);

              case 9:
                return _context.abrupt('return', _context.sent);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function redirectAuthUrl(_x3, _x4, _x5, _x6, _x7, _x8) {
        return _ref.apply(this, arguments);
      }

      return redirectAuthUrl;
    }()

    /**
     * @param {Koa.Context} ctx
     * @param {string} strategy
     * @param {boolean} isConnected
     * @returns {*}
     */

  }, {
    key: 'accessResponse',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, strategy, isConnected) {
        var error, code, state, cookieName, cookie, tokens, user, connectedUser;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!ctx.query.error) {
                  _context2.next = 5;
                  break;
                }

                error = new Error(ctx.query.error);

                error.status = 403;
                error.expose = true;
                throw error;

              case 5:
                code = ctx.query.code;
                state = ctx.query.state;
                cookieName = 'auth_' + strategy + '_' + state;
                cookie = ctx.cookies.get(cookieName);

                ctx.cookies.set(cookieName, '', { expires: new Date(1) });

                if (cookie) {
                  _context2.next = 12;
                  break;
                }

                throw new Error('No cookie for this state');

              case 12:

                cookie = JSON.parse(cookie);

                if (!(!cookie || !cookie.scope)) {
                  _context2.next = 15;
                  break;
                }

                throw new Error('Unexpected cookie value');

              case 15:
                if (cookie.isLoginAccess) {
                  _context2.next = 18;
                  break;
                }

                if (isConnected) {
                  _context2.next = 18;
                  break;
                }

                throw new Error('You are not connected');

              case 18:
                _context2.next = 20;
                return this.getTokens(strategy, {
                  code: code,
                  redirectUri: this.redirectUri(ctx, strategy)
                });

              case 20:
                tokens = _context2.sent;

                if (!cookie.isLoginAccess) {
                  _context2.next = 26;
                  break;
                }

                _context2.next = 24;
                return this.userAccountsService.findOrCreateFromGoogle(strategy, tokens, cookie.scope, cookie.scopeKey);

              case 24:
                user = _context2.sent;
                return _context2.abrupt('return', user);

              case 26:

                ctx.cookies.set(cookieName, '', { expires: new Date(1) });
                connectedUser = ctx.state.connected;
                _context2.next = 30;
                return this.userAccountsService.update(connectedUser, strategy, tokens, cookie.scope, cookie.scopeKey);

              case 30:
                return _context2.abrupt('return', connectedUser);

              case 31:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function accessResponse(_x9, _x10, _x11) {
        return _ref2.apply(this, arguments);
      }

      return accessResponse;
    }()
  }, {
    key: 'refreshAccountTokens',
    value: function refreshAccountTokens(user, account) {
      var _this2 = this;

      if (account.tokenExpireDate && account.tokenExpireDate.getTime() > Date.now()) {
        return Promise.resolve(false);
      }
      return this.refreshToken(account.provider, {
        accessToken: account.accessToken,
        refreshToken: account.refreshToken
      }).then(function (tokens) {
        if (!tokens) {
          // serviceGoogle.updateFields({ accessToken:null, refreshToken:null, status: .OUTDATED });
          return false;
        }
        account.accessToken = tokens.accessToken;
        account.tokenExpireDate = tokens.expireDate;
        return _this2.userAccountsService.updateAccount(user, account).then(function () {
          return true;
        });
      });
    }
  }]);

  return AuthenticationService;
}(EventEmitter);

export default AuthenticationService;
//# sourceMappingURL=AuthenticationService.js.map