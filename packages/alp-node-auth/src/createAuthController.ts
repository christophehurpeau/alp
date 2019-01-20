import AuthenticationService from './services/authentification/AuthenticationService';

export default function createAuthController({
  usersManager,
  authenticationService,
  homeRouterKey = '/',
}: {
  authenticationService: AuthenticationService;
  homeRouterKey?: string;
  usersManager: any;
}) {
  return {
    async login(ctx: any) {
      const strategy = ctx.namedParam('strategy');
      if (!strategy) throw new Error('Strategy missing');
      await authenticationService.redirectAuthUrl(ctx, strategy);
    },

    async loginResponse(ctx: any) {
      if (ctx.state.connected) {
        ctx.redirect(ctx.urlGenerator(homeRouterKey));
      }

      const strategy = ctx.namedParam('strategy');
      ctx.assert(strategy);

      const connectedUser = await authenticationService.accessResponse(
        ctx,
        strategy,
      );
      const keyPath: string = usersManager.store.keyPath;
      await ctx.setConnected(connectedUser[keyPath], connectedUser);
      ctx.state.connected = connectedUser;
      await ctx.redirect(ctx.urlGenerator(homeRouterKey));
    },

    async logout(ctx: any) {
      ctx.logout();
      await ctx.redirect(ctx.urlGenerator(homeRouterKey));
    },
  };
}
