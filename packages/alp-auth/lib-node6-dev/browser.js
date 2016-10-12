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

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _createAuthController = require('./controllers/createAuthController.browser');

var _createAuthController2 = _interopRequireDefault(_createAuthController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(_ref) {
  var _assert2 = _assert(_ref, _tcombForked2.default.interface({
    controllers: Map,
    loginModuleDescriptor: _tcombForked2.default.Object,
    homeRouterKey: _tcombForked2.default.maybe(_tcombForked2.default.String)
  }), '{ controllers, loginModuleDescriptor, homeRouterKey }');

  let controllers = _assert2.controllers;
  let loginModuleDescriptor = _assert2.loginModuleDescriptor;
  let homeRouterKey = _assert2.homeRouterKey;

  _assert({
    controllers,
    loginModuleDescriptor,
    homeRouterKey
  }, _tcombForked2.default.interface({
    controllers: Map,
    loginModuleDescriptor: _tcombForked2.default.Object,
    homeRouterKey: _tcombForked2.default.maybe(_tcombForked2.default.String)
  }), '{ controllers, loginModuleDescriptor, homeRouterKey }');

  return app => {
    controllers.set('auth', (0, _createAuthController2.default)({
      loginModuleDescriptor,
      homeRouterKey
    }));
  };
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=browser.js.map