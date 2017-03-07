import t from 'flow-runtime';
export default function createAuthController({
  loginModuleDescriptor,
  homeRouterKey = 'home'
}) {
  t.param('arguments[0]', t.object(t.property('loginModuleDescriptor', t.object()), t.property('homeRouterKey', t.nullable(t.string())))).assert(arguments[0]);

  return {
    async login(ctx) {
      if (ctx.state.connected) {
        ctx.redirect(ctx.urlGenerator(homeRouterKey));
      }

      await ctx.render(loginModuleDescriptor);
    }
  };
}
//# sourceMappingURL=createAuthController.browser.js.map