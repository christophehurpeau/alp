'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAuthController;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createAuthController({
  loginModuleDescriptor,
  homeRouterKey = 'home'
}) {
  _flowRuntime2.default.param('arguments[0]', _flowRuntime2.default.object(_flowRuntime2.default.property('loginModuleDescriptor', _flowRuntime2.default.object()), _flowRuntime2.default.property('homeRouterKey', _flowRuntime2.default.nullable(_flowRuntime2.default.string())))).assert(arguments[0]);

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