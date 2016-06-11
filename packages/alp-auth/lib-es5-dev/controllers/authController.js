'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = createAuthController;

var _AuthenticationService = require('../services/AuthenticationService');

var _AuthenticationService2 = _interopRequireDefault(_AuthenticationService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function createAuthController(_ref) {
    var authenticationService = _ref.authenticationService;
    var loginModuleDescriptor = _ref.loginModuleDescriptor;
    var _ref$homeRouterKey = _ref.homeRouterKey;
    var homeRouterKey = _ref$homeRouterKey === undefined ? 'home' : _ref$homeRouterKey;

    if (!(arguments[0] != null && arguments[0].authenticationService instanceof _AuthenticationService2.default && arguments[0].loginModuleDescriptor instanceof Object && (arguments[0].homeRouterKey == null || typeof arguments[0].homeRouterKey === 'string'))) {
        throw new TypeError('Value of argument 0 violates contract.\n\nExpected:\n{ authenticationService: AuthenticationService;\n  loginModuleDescriptor: Object;\n  homeRouterKey: ?string;\n}\n\nGot:\n' + _inspect(arguments[0]));
    }

    return {
        login: function login(ctx) {
            var _this = this;

            return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var strategy;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (ctx.state.connected) {
                                    ctx.redirect(ctx.urlGenerator(homeRouterKey));
                                }

                                strategy = ctx.namedParam('strategy');

                                if (!strategy) {
                                    _context.next = 6;
                                    break;
                                }

                                _context.next = 5;
                                return authenticationService.redirectAuthUrl(ctx, strategy);

                            case 5:
                                return _context.abrupt('return');

                            case 6:
                                _context.next = 8;
                                return ctx.render(loginModuleDescriptor);

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this);
            }))();
        },
        loginResponse: function loginResponse(ctx) {
            var _this2 = this;

            return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var strategy, connectedUser;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (ctx.state.connected) {
                                    ctx.redirect(ctx.urlGenerator(homeRouterKey));
                                }

                                strategy = ctx.namedParam('strategy');

                                ctx.assert(strategy);

                                _context2.next = 5;
                                return authenticationService.accessResponse(ctx, strategy);

                            case 5:
                                connectedUser = _context2.sent;
                                _context2.next = 8;
                                return ctx.setConnected(connectedUser._id, connectedUser);

                            case 8:
                                ctx.state.connected = connectedUser;
                                _context2.next = 11;
                                return ctx.redirect(ctx.urlGenerator(homeRouterKey));

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, _this2);
            }))();
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
        return typeof input === 'undefined' ? 'undefined' : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(function (item) {
                    return _inspect(item, depth) === first;
                })) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(function (item) {
                            return _inspect(item, depth);
                        }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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
        var entries = keys.slice(0, maxKeys).map(function (key) {
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