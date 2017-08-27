import AuthenticationService from './services/AuthenticationService';

import t from 'flow-runtime';
export default function createAuthController(_arg) {
  let {
    usersManager,
    authenticationService,
    homeRouterKey = '/'
  } = t.object(t.property('usersManager', t.object()), t.property('authenticationService', t.ref(AuthenticationService)), t.property('homeRouterKey', t.nullable(t.string()))).assert(_arg);

  return {
    async login(ctx) {
      const strategy = ctx.namedParam('strategy');
      if (!strategy) throw new Error('Strategy missing');
      await authenticationService.redirectAuthUrl(ctx, strategy);
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
//# sourceMappingURL=createAuthController.js.map