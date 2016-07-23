function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

import { sign, verify } from 'jsonwebtoken';
import promiseCallback from 'promise-callback-factory';
import Logger from 'nightingale-logger';
import UsersManager from './models/user/UsersManager';
import AuthenticationService from './services/AuthenticationService';
import UserAccountsService from './services/user/UserAccountsService';
import createAuthController from './controllers/authController';

export { UsersManager };
export { default as routes } from './routes';

var COOKIE_NAME = 'connectedUser';
var logger = new Logger('alp-auth');

export default function init({
    controllers,
    usersManager,
    strategies,
    loginModuleDescriptor,
    homeRouterKey
}) {
    if (!(arguments[0] != null && arguments[0].controllers instanceof Map && arguments[0].usersManager instanceof UsersManager && arguments[0].strategies instanceof Object && arguments[0].loginModuleDescriptor instanceof Object && (arguments[0].homeRouterKey == null || typeof arguments[0].homeRouterKey === 'string'))) {
        throw new TypeError('Value of argument 0 violates contract.\n\nExpected:\n{ controllers: Map;\n  usersManager: UsersManager;\n  strategies: Object;\n  loginModuleDescriptor: Object;\n  homeRouterKey: ?string;\n}\n\nGot:\n' + _inspect(arguments[0]));
    }

    return app => {
        var userAccountsService = new UserAccountsService(usersManager);

        var authenticationService = new AuthenticationService(app.config, strategies, userAccountsService);

        controllers.set('auth', createAuthController({
            authenticationService,
            loginModuleDescriptor,
            homeRouterKey
        }));

        app.context.setConnected = (() => {
            var ref = _asyncToGenerator(function* (connected, user) {
                var _this = this;

                if (!(typeof connected === 'number' || typeof connected === 'string')) {
                    throw new TypeError('Value of argument "connected" violates contract.\n\nExpected:\nnumber | string\n\nGot:\n' + _inspect(connected));
                }

                if (!(user instanceof Object)) {
                    throw new TypeError('Value of argument "user" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(user));
                }

                logger.debug('setConnected', { connected });
                if (!connected) {
                    throw new Error('Illegal value for setConnected');
                }

                this.state.connected = connected;
                this.state.user = user;

                var token = yield promiseCallback(function (done) {
                    return sign({ connected, time: Date.now() }, _this.config.get('authentication').get('secretKey'), {
                        algorithm: 'HS512',
                        audience: _this.request.headers['user-agent'],
                        expiresIn: '30 days'
                    }, done);
                });

                this.cookies.set(COOKIE_NAME, token, {
                    httpOnly: true,
                    secure: this.config.get('allowHttps')
                });
            });

            return function (_x, _x2) {
                return ref.apply(this, arguments);
            };
        })();

        app.context.logout = function () {
            delete this.state.connected;
            delete this.state.user;
            this.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
        };

        app.registerBrowserStateTransformers((initialBrowserState, ctx) => {
            if (ctx.state.connected) {
                initialBrowserState.connected = ctx.state.connected;
                initialBrowserState.user = usersManager.transformForBrowser(ctx.state.user);
            }
        });

        return (() => {
            var ref = _asyncToGenerator(function* (ctx, next) {
                var token = ctx.cookies.get(COOKIE_NAME);
                logger.debug('middleware', { token });
                if (!token) return yield next();

                var connected = undefined;
                try {
                    var decoded = yield verify(token, ctx.config.get('authentication').get('secretKey'), {
                        algorithm: 'HS512',
                        audience: ctx.request.headers['user-agent']
                    });
                    connected = decoded.connected;
                } catch (err) {
                    logger.info('failed to verify authentification', { err });
                    ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
                    return yield next();
                }
                logger.debug('middleware', { connected });

                if (!connected) return yield next();

                var user = yield usersManager.findConnected(connected);

                if (!user) {
                    ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
                    return yield next();
                }

                ctx.state.connected = connected;
                ctx.state.user = user;

                yield next();
            });

            return function (_x3, _x4) {
                return ref.apply(this, arguments);
            };
        })();
    };
}

function _inspect(input, depth) {
    var maxDepth = 4;
    var maxKeys = 15;

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
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(item => _inspect(item, depth) === first)) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if (typeof _ret === "object") return _ret.v;
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        var indent = '  '.repeat(depth - 1);
        var entries = keys.slice(0, maxKeys).map(key => {
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
//# sourceMappingURL=index.server.js.map