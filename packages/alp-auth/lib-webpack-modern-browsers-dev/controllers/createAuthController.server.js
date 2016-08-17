function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

import AuthenticationService from '../services/AuthenticationService';

export default function createAuthController(_ref) {
    var authenticationService = _ref.authenticationService;
    var loginModuleDescriptor = _ref.loginModuleDescriptor;
    var _ref$homeRouterKey = _ref.homeRouterKey;
    var homeRouterKey = _ref$homeRouterKey === undefined ? 'home' : _ref$homeRouterKey;

    if (!(arguments[0] != null && arguments[0].authenticationService instanceof AuthenticationService && arguments[0].loginModuleDescriptor instanceof Object && (arguments[0].homeRouterKey == null || typeof arguments[0].homeRouterKey === 'string'))) {
        throw new TypeError('Value of argument 0 violates contract.\n\nExpected:\n{\n  authenticationService: AuthenticationService;\n  loginModuleDescriptor: Object;\n  homeRouterKey: ?string;\n}\n\nGot:\n' + _inspect(arguments[0]));
    }

    return {
        login(ctx) {
            return _asyncToGenerator(function* () {
                if (ctx.state.connected) {
                    ctx.redirect(ctx.urlGenerator(homeRouterKey));
                }

                var strategy = ctx.namedParam('strategy');
                if (strategy) {
                    yield authenticationService.redirectAuthUrl(ctx, strategy);
                    return;
                }

                yield ctx.render(loginModuleDescriptor);
            })();
        },

        loginResponse(ctx) {
            return _asyncToGenerator(function* () {
                if (ctx.state.connected) {
                    ctx.redirect(ctx.urlGenerator(homeRouterKey));
                }

                var strategy = ctx.namedParam('strategy');
                ctx.assert(strategy);

                var connectedUser = yield authenticationService.accessResponse(ctx, strategy);
                yield ctx.setConnected(connectedUser._id, connectedUser);
                ctx.state.connected = connectedUser;
                yield ctx.redirect(ctx.urlGenerator(homeRouterKey));
            })();
        },

        logout(ctx) {
            return _asyncToGenerator(function* () {
                ctx.logout();
                yield ctx.redirect(ctx.urlGenerator(homeRouterKey));
            })();
        }
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
//# sourceMappingURL=createAuthController.server.js.map