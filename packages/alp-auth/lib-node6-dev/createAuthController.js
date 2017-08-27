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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function createAuthController(_arg) {
  let {
    usersManager,
    authenticationService,
    homeRouterKey = '/'
  } = _flowRuntime2.default.object(_flowRuntime2.default.property('usersManager', _flowRuntime2.default.object()), _flowRuntime2.default.property('authenticationService', _flowRuntime2.default.ref(_AuthenticationService2.default)), _flowRuntime2.default.property('homeRouterKey', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))).assert(_arg);

  return {
    login(ctx) {
      return _asyncToGenerator(function* () {
        const strategy = ctx.namedParam('strategy');
        if (!strategy) throw new Error('Strategy missing');
        yield authenticationService.redirectAuthUrl(ctx, strategy);
      })();
    },

    loginResponse(ctx) {
      return _asyncToGenerator(function* () {
        if (ctx.state.connected) {
          ctx.redirect(ctx.urlGenerator(homeRouterKey));
        }

        const strategy = ctx.namedParam('strategy');
        ctx.assert(strategy);

        const connectedUser = yield authenticationService.accessResponse(ctx, strategy);
        const keyPath = _flowRuntime2.default.string().assert(usersManager.store.keyPath);
        yield ctx.setConnected(connectedUser[keyPath], connectedUser);
        ctx.state.connected = connectedUser;
        yield ctx.redirect(ctx.urlGenerator(homeRouterKey));
      })();
    },

    logout(ctx) {
      return _asyncToGenerator(function* () {
        ctx.logout();
        yield ctx.redirect(ctx.urlGenerator(homeRouterKey));
      })();
    }
  };
}
//# sourceMappingURL=createAuthController.js.map