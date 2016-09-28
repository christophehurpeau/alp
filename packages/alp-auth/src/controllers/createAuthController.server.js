import AuthenticationService from '../services/AuthenticationService';

export default function createAuthController({
  usersManager,
  authenticationService,
  loginModuleDescriptor,
  homeRouterKey = 'home',
}: {
  usersManager: Object,
  authenticationService: AuthenticationService,
  loginModuleDescriptor: Object,
  homeRouterKey: ?string,
}) {
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
      const keyPath: string = usersManager.store.keyPath;
      await ctx.setConnected(connectedUser[keyPath], connectedUser);
      ctx.state.connected = connectedUser;
      await ctx.redirect(ctx.urlGenerator(homeRouterKey));
    },

    async logout(ctx) {
      ctx.logout();
      await ctx.redirect(ctx.urlGenerator(homeRouterKey));
    },
  };
}
