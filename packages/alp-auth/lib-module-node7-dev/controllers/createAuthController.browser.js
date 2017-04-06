import t from 'flow-runtime';
export default function createAuthController(_arg) {
  let {
    loginModuleDescriptor,
    homeRouterKey = 'home'
  } = t.object(t.property('loginModuleDescriptor', t.object()), t.property('homeRouterKey', t.nullable(t.string()))).assert(_arg);

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