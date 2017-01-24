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

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _createAuthController = require('./controllers/createAuthController.browser');

var _createAuthController2 = _interopRequireDefault(_createAuthController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init({
  controllers,
  loginModuleDescriptor,
  homeRouterKey
}) {
  _assert({
    controllers,
    loginModuleDescriptor,
    homeRouterKey
  }, _tcombForked2.default.interface({
    controllers: Map,
    loginModuleDescriptor: _tcombForked2.default.Object,
    homeRouterKey: _tcombForked2.default.maybe(_tcombForked2.default.String)
  }), '{ controllers, loginModuleDescriptor, homeRouterKey }');

  return () => {
    controllers.set('auth', (0, _createAuthController2.default)({
      loginModuleDescriptor,
      homeRouterKey
    }));
  };
}

function _assert(x, type, name) {
  if (false) {
    _tcombForked2.default.fail = function (message) {
      console.warn(message);
    };
  }

  if (_tcombForked2.default.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail('Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=browser.js.map