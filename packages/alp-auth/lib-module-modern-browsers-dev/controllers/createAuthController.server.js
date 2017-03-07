function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import AuthenticationService from '../services/AuthenticationService';

import t from 'flow-runtime';
export default function createAuthController({
  usersManager,
  authenticationService,
  loginModuleDescriptor,
  homeRouterKey = 'home'
}) {
  t.param('arguments[0]', t.object(t.property('usersManager', t.object()), t.property('authenticationService', t.ref(AuthenticationService)), t.property('loginModuleDescriptor', t.object()), t.property('homeRouterKey', t.nullable(t.string())))).assert(arguments[0]);

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
        const keyPath = t.string().assert(usersManager.store.keyPath);
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