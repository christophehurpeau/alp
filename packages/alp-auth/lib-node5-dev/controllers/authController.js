'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createAuthController;

var _AuthenticationService = require('../services/AuthenticationService');

var _AuthenticationService2 = _interopRequireDefault(_AuthenticationService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function createAuthController(_ref) {
    let authenticationService = _ref.authenticationService;
    let loginModuleDescriptor = _ref.loginModuleDescriptor;
    var _ref$homeRouterKey = _ref.homeRouterKey;
    let homeRouterKey = _ref$homeRouterKey === undefined ? 'home' : _ref$homeRouterKey;

    if (!(arguments[0] != null && arguments[0].authenticationService instanceof _AuthenticationService2.default && arguments[0].loginModuleDescriptor instanceof Object && (arguments[0].homeRouterKey == null || typeof arguments[0].homeRouterKey === 'string'))) {
        throw new TypeError('Value of argument 0 violates contract.\n\nExpected:\n{ authenticationService: AuthenticationService;\n  loginModuleDescriptor: Object;\n  homeRouterKey: ?string;\n}\n\nGot:\n' + _inspect(arguments[0]));
    }

    return {
        login: function login(ctx) {
            return _asyncToGenerator(function* () {
                if (ctx.state.connected) {
                    ctx.redirect(ctx.urlGenerator(homeRouterKey));
                }

                const strategy = ctx.namedParam('strategy');
                if (strategy) {
                    yield authenticationService.redirectAuthUrl(ctx, strategy);
                    return;
                }

                yield ctx.render(loginModuleDescriptor);
            })();
        },
        loginResponse: function loginResponse(ctx) {
            return _asyncToGenerator(function* () {
                if (ctx.state.connected) {
                    ctx.redirect(ctx.urlGenerator(homeRouterKey));
                }

                const strategy = ctx.namedParam('strategy');
                ctx.assert(strategy);

                const connectedUser = yield authenticationService.accessResponse(ctx, strategy);
                yield ctx.setConnected(connectedUser._id, connectedUser);
                ctx.state.connected = connectedUser;
                yield ctx.redirect(ctx.urlGenerator(homeRouterKey));
            })();
        }
    };
}

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
//# sourceMappingURL=authController.js.map