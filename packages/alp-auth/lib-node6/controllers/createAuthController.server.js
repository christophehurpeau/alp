'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAuthController;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function createAuthController(_ref) {
  let usersManager = _ref.usersManager;
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
        const keyPath = usersManager.store.keyPath;
        yield ctx.setConnected(connectedUser[keyPath], connectedUser);
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