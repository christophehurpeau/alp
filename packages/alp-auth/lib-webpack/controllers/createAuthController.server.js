function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

export default function createAuthController(_ref) {
    var authenticationService = _ref.authenticationService;
    var loginModuleDescriptor = _ref.loginModuleDescriptor;
    var _ref$homeRouterKey = _ref.homeRouterKey;
    var homeRouterKey = _ref$homeRouterKey === undefined ? 'home' : _ref$homeRouterKey;

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
        },
        logout: function logout(ctx) {
            var _this3 = this;

            return _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                ctx.logout();
                                _context3.next = 3;
                                return ctx.redirect(ctx.urlGenerator(homeRouterKey));

                            case 3:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, _this3);
            }))();
        }
    };
}
//# sourceMappingURL=createAuthController.server.js.map