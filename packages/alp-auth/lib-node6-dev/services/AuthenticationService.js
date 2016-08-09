'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _promiseCallbackFactory = require('promise-callback-factory');

var _promiseCallbackFactory2 = _interopRequireDefault(_promiseCallbackFactory);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _UserAccountsService = require('./user/UserAccountsService');

var _UserAccountsService2 = _interopRequireDefault(_UserAccountsService);

var _generators = require('../utils/generators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /* eslint camelcase: "off" */


const logger = new _nightingaleLogger2.default('alp-auth.services.authentication');

const GenerateAuthUrlOptions = function () {
    function GenerateAuthUrlOptions(input) {
        return input != null && (input.redirectUri === undefined || typeof input.redirectUri === 'string') && (input.scope === undefined || typeof input.scope === 'string') && (input.state === undefined || typeof input.state === 'string') && (input.grantType === undefined || typeof input.grantType === 'string') && (input.accessType === undefined || typeof input.accessType === 'string') && (input.prompt === undefined || typeof input.prompt === 'string') && (input.loginHint === undefined || typeof input.loginHint === 'string') && (input.includeGrantedScopes === undefined || typeof input.includeGrantedScopes === 'boolean');
    }

    ;
    Object.defineProperty(GenerateAuthUrlOptions, Symbol.hasInstance, {
        value: function value(input) {
            return GenerateAuthUrlOptions(input);
        }
    });
    return GenerateAuthUrlOptions;
}();

const GetTokensOptions = function () {
    function GetTokensOptions(input) {
        return input != null && typeof input.code === 'string' && typeof input.redirectUri === 'string';
    }

    ;
    Object.defineProperty(GetTokensOptions, Symbol.hasInstance, {
        value: function value(input) {
            return GetTokensOptions(input);
        }
    });
    return GetTokensOptions;
}();

class AuthenticationService extends _events2.default {

    constructor(config, strategies, userAccountsService) {
        if (!(strategies instanceof Object)) {
            throw new TypeError('Value of argument "strategies" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(strategies));
        }

        if (!(userAccountsService instanceof _UserAccountsService2.default)) {
            throw new TypeError('Value of argument "userAccountsService" violates contract.\n\nExpected:\nUserAccountsService\n\nGot:\n' + _inspect(userAccountsService));
        }

        super();
        this.config = config;

        if (!(this.config instanceof Object)) {
            throw new TypeError('Value of "this.config" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(this.config));
        }

        this.strategies = strategies;
        this.userAccountsService = userAccountsService;
    }

    /**
     *
     * @param {string} strategy
     * @param {Object} options
     * @param {string} [options.redirectUri]
     * @param {string} [options.scope] Space-delimited set of permissions that the application requests.
     * @param {string} [options.state] Any string that might be useful to your application upon receipt of the response
     * @param {string} [options.grantType]
     * @param {string} [options.accessType = 'online'] online or offline
     * @param {string} [options.prompt] Space-delimited, case-sensitive list of prompts to present the user. values: none, consent, select_account
     * @param {string} [options.loginHint] email address or sub identifier
     * @param {boolean} [options.includeGrantedScopes] If this is provided with the value true, and the authorization request is granted, the authorization will include any previous authorizations granted to this user/application combination for other scopes
     * @returns {string}
     */
    generateAuthUrl(strategy) {
        let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        if (!(typeof strategy === 'string')) {
            throw new TypeError('Value of argument "strategy" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(strategy));
        }

        if (!GenerateAuthUrlOptions(options)) {
            throw new TypeError('Value of argument "options" violates contract.\n\nExpected:\nGenerateAuthUrlOptions\n\nGot:\n' + _inspect(options));
        }

        logger.debug('generateAuthUrl', { strategy, options });
        const strategyInstance = this.strategies[strategy];
        switch (strategyInstance.type) {
            case 'oauth2':
                return strategyInstance.oauth2.authCode.authorizeURL({
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

    getTokens(strategy) {
        let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        if (!(typeof strategy === 'string')) {
            throw new TypeError('Value of argument "strategy" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(strategy));
        }

        if (!GetTokensOptions(options)) {
            throw new TypeError('Value of argument "options" violates contract.\n\nExpected:\nGetTokensOptions\n\nGot:\n' + _inspect(options));
        }

        logger.debug('getTokens', { strategy, options });
        const strategyInstance = this.strategies[strategy];
        switch (strategyInstance.type) {
            case 'oauth2':
                return (0, _promiseCallbackFactory2.default)(done => {
                    strategyInstance.oauth2.authCode.getToken({
                        code: options.code,
                        redirect_uri: options.redirectUri
                    }, done);
                }).then(result => {
                    return result && {
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
                    ;
                });
        }
    }

    refreshToken(strategy, tokens) {
        if (!(typeof strategy === 'string')) {
            throw new TypeError('Value of argument "strategy" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(strategy));
        }

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
                    return (0, _promiseCallbackFactory2.default)(done => {
                        return token.refresh(done);
                    }).then(result => {
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
        if (!(typeof strategy === 'string')) {
            throw new TypeError('Value of argument "strategy" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(strategy));
        }

        const host = `http${ this.config.get('allowHttps') ? 's' : '' }://${ ctx.request.host }`;
        return `${ host }${ ctx.urlGenerator('loginResponse', { strategy }) }`;
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
            if (!(ctx instanceof Object)) {
                throw new TypeError('Value of argument "ctx" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(ctx));
            }

            if (!(typeof strategy === 'string')) {
                throw new TypeError('Value of argument "strategy" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(strategy));
            }

            if (!(refreshToken == null || typeof refreshToken === 'string')) {
                throw new TypeError('Value of argument "refreshToken" violates contract.\n\nExpected:\n?string\n\nGot:\n' + _inspect(refreshToken));
            }

            if (!(scopeKey == null || typeof scopeKey === 'string')) {
                throw new TypeError('Value of argument "scopeKey" violates contract.\n\nExpected:\n?string\n\nGot:\n' + _inspect(scopeKey));
            }

            logger.debug('redirectAuthUrl', { strategy, scopeKey, refreshToken });
            const state = yield (0, _generators.randomHex)(8);
            const isLoginAccess = !scopeKey || scopeKey === 'login';
            const scope = _this.userAccountsService.getScope(strategy, scopeKey || 'login', user, accountId);

            ctx.cookies.set(`auth_${ strategy }_${ state }`, JSON.stringify({
                scopeKey: scopeKey,
                scope: scope,
                isLoginAccess: isLoginAccess
            }), {
                maxAge: 600000,
                httpOnly: true,
                secure: _this.config.get('allowHttps')
            });
            const redirectUri = _this.generateAuthUrl(strategy, {
                redirectUri: _this.redirectUri(ctx, strategy),
                scope: scope,
                state: state,
                accessType: refreshToken ? 'offline' : 'online'
            });

            return yield ctx.redirect(redirectUri);
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
            if (!(typeof strategy === 'string')) {
                throw new TypeError('Value of argument "strategy" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(strategy));
            }

            if (!(isConnected == null || typeof isConnected === 'boolean')) {
                throw new TypeError('Value of argument "isConnected" violates contract.\n\nExpected:\n?bool\n\nGot:\n' + _inspect(isConnected));
            }

            if (ctx.query.error) {
                const error = new Error(ctx.query.error);
                error.status = 403;
                error.expose = true;
                throw error;
            }

            const code = ctx.query.code;
            const state = ctx.query.state;
            const cookieName = `auth_${ strategy }_${ state }`;
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
                code: code,
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
                // serviceGoogle.updateFields({ accessToken:null, refreshToken:null, status: M.Service.OUTDATED });
                return false;
            }
            account.accessToken = tokens.accessToken;
            account.tokenExpireDate = tokens.expireDate;
            return this.userAccountsService.updateAccount(user, account).then(() => {
                return true;
            });
        });
    }
}
exports.default = AuthenticationService;

function _inspect(input, depth) {
    const maxDepth = 4;
    const maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            if (depth > maxDepth) return '[...]';

            const first = _inspect(input[0], depth);

            if (input.every(item => _inspect(item, depth) === first)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        const keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        const indent = '  '.repeat(depth - 1);
        let entries = keys.slice(0, maxKeys).map(key => {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=AuthenticationService.js.map