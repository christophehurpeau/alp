'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAuthController;

var _AuthenticationService = require('./services/AuthenticationService');

var _AuthenticationService2 = _interopRequireDefault(_AuthenticationService);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createAuthController(_arg) {
  let {
    usersManager,
    authenticationService,
    homeRouterKey = '/'
  } = _flowRuntime2.default.object(_flowRuntime2.default.property('usersManager', _flowRuntime2.default.object()), _flowRuntime2.default.property('authenticationService', _flowRuntime2.default.ref(_AuthenticationService2.default)), _flowRuntime2.default.property('homeRouterKey', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))).assert(_arg);

  return {
    async login(ctx) {
      const strategy = ctx.namedParam('strategy');
      if (!strategy) throw new Error('Strategy missing');
      await authenticationService.redirectAuthUrl(ctx, strategy);
    },

    async loginResponse(ctx) {
      ctx.state.connected && ctx.redirect(ctx.urlGenerator(homeRouterKey));


      const strategy = ctx.namedParam('strategy');
      ctx.assert(strategy);


      const connectedUser = await authenticationService.accessResponse(ctx, strategy);
      const keyPath = _flowRuntime2.default.string().assert(usersManager.store.keyPath);
      await ctx.setConnected(connectedUser[keyPath], connectedUser), ctx.state.connected = connectedUser, await ctx.redirect(ctx.urlGenerator(homeRouterKey));
    },

    async logout(ctx) {
      ctx.logout(), await ctx.redirect(ctx.urlGenerator(homeRouterKey));
    }
  };
}
//# sourceMappingURL=createAuthController.js.map