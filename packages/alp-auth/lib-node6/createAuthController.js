'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAuthController;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { return void reject(error); } return info.done ? void resolve(value) : Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } return step("next"); }); }; }

function createAuthController({
  usersManager,
  authenticationService,
  homeRouterKey = '/'
}) {
  return {
    login(ctx) {
      return _asyncToGenerator(function* () {
        const strategy = ctx.namedParam('strategy');
        if (!strategy) throw new Error('Strategy missing');
        yield authenticationService.redirectAuthUrl(ctx, strategy);
      })();
    },

    loginResponse(ctx) {
      return _asyncToGenerator(function* () {
        ctx.state.connected && ctx.redirect(ctx.urlGenerator(homeRouterKey));


        const strategy = ctx.namedParam('strategy');
        ctx.assert(strategy);


        const connectedUser = yield authenticationService.accessResponse(ctx, strategy);
        const keyPath = usersManager.store.keyPath;
        yield ctx.setConnected(connectedUser[keyPath], connectedUser), ctx.state.connected = connectedUser, yield ctx.redirect(ctx.urlGenerator(homeRouterKey));
      })();
    },

    logout(ctx) {
      return _asyncToGenerator(function* () {
        ctx.logout(), yield ctx.redirect(ctx.urlGenerator(homeRouterKey));
      })();
    }
  };
}
//# sourceMappingURL=createAuthController.js.map