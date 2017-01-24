function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

export default function createAuthController({
  usersManager,
  authenticationService,
  loginModuleDescriptor,
  homeRouterKey = 'home'
}) {
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
        var keyPath = usersManager.store.keyPath;
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