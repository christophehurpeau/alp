'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = undefined;

var _routes = require('./routes');

Object.defineProperty(exports, 'routes', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_routes).default;
  }
});
exports.default = init;

var _createAuthController = require('./controllers/createAuthController.browser');

var _createAuthController2 = _interopRequireDefault(_createAuthController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(_ref) {
  let controllers = _ref.controllers;
  let loginModuleDescriptor = _ref.loginModuleDescriptor;
  let homeRouterKey = _ref.homeRouterKey;

  return app => {
    controllers.set('auth', (0, _createAuthController2.default)({
      loginModuleDescriptor,
      homeRouterKey
    }));
  };
}
//# sourceMappingURL=browser.js.map