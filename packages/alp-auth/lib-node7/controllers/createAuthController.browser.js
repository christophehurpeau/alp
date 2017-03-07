'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAuthController;
function createAuthController({
  loginModuleDescriptor,
  homeRouterKey = 'home'
}) {
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