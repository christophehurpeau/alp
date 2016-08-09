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

    return {
        login(ctx) {
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

        loginResponse(ctx) {
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
        },

        logout(ctx) {
            return _asyncToGenerator(function* () {
                ctx.logout();
                yield ctx.redirect(ctx.urlGenerator(homeRouterKey));
            })();
        }
    };
}
//# sourceMappingURL=createAuthController.server.js.map