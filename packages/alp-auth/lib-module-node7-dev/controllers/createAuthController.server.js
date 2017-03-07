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
    async login(ctx) {
      if (ctx.state.connected) {
        ctx.redirect(ctx.urlGenerator(homeRouterKey));
      }

      const strategy = ctx.namedParam('strategy');
      if (strategy) {
        await authenticationService.redirectAuthUrl(ctx, strategy);
        return;
      }

      await ctx.render(loginModuleDescriptor);
    },

    async loginResponse(ctx) {
      if (ctx.state.connected) {
        ctx.redirect(ctx.urlGenerator(homeRouterKey));
      }

      const strategy = ctx.namedParam('strategy');
      ctx.assert(strategy);

      const connectedUser = await authenticationService.accessResponse(ctx, strategy);
      const keyPath = t.string().assert(usersManager.store.keyPath);
      await ctx.setConnected(connectedUser[keyPath], connectedUser);
      ctx.state.connected = connectedUser;
      await ctx.redirect(ctx.urlGenerator(homeRouterKey));
    },

    async logout(ctx) {
      ctx.logout();
      await ctx.redirect(ctx.urlGenerator(homeRouterKey));
    }
  };
}
//# sourceMappingURL=createAuthController.server.js.map