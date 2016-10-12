import _t from 'tcomb-forked';
import createAuthController from './controllers/createAuthController.browser';

export { default as routes } from './routes';

export default function init(_ref) {
  var controllers = _ref.controllers;
  var loginModuleDescriptor = _ref.loginModuleDescriptor;
  var homeRouterKey = _ref.homeRouterKey;

  _assert({
    controllers: controllers,
    loginModuleDescriptor: loginModuleDescriptor,
    homeRouterKey: homeRouterKey
  }, _t.interface({
    controllers: Map,
    loginModuleDescriptor: _t.Object,
    homeRouterKey: _t.maybe(_t.String)
  }), '{ controllers, loginModuleDescriptor, homeRouterKey }');

  return function (app) {
    controllers.set('auth', createAuthController({
      loginModuleDescriptor: loginModuleDescriptor,
      homeRouterKey: homeRouterKey
    }));
  };
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=browser.js.map