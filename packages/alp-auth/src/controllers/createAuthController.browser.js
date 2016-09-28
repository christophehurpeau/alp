export default function createAuthController({
    loginModuleDescriptor,
    homeRouterKey = 'home',
}: {
    loginModuleDescriptor: Object,
    homeRouterKey: ?string,
}) {
  return {
    async login(ctx) {
      if (ctx.state.connected) {
        ctx.redirect(ctx.urlGenerator(homeRouterKey));
      }

      await ctx.render(loginModuleDescriptor);
    },
  };
}
