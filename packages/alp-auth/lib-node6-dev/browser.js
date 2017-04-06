'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = undefined;

var _routes = require('./routes');

Object.defineProperty(exports, 'routes', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_routes).default;
  }
});
exports.default = init;

var _createAuthController = require('./controllers/createAuthController.browser');

var _createAuthController2 = _interopRequireDefault(_createAuthController);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(_arg) {
  let {
    controllers,
    loginModuleDescriptor,
    homeRouterKey
  } = _flowRuntime2.default.object(_flowRuntime2.default.property('controllers', _flowRuntime2.default.ref('Map')), _flowRuntime2.default.property('loginModuleDescriptor', _flowRuntime2.default.object()), _flowRuntime2.default.property('homeRouterKey', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))).assert(_arg);

  return () => {
    controllers.set('auth', (0, _createAuthController2.default)({
      loginModuleDescriptor,
      homeRouterKey
    }));
  };
}
//# sourceMappingURL=browser.js.map