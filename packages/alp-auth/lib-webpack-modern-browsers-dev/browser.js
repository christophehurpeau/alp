import _t from 'tcomb-forked';
import createAuthController from './controllers/createAuthController.browser';

export { default as routes } from './routes';

export default function init({
  controllers,
  loginModuleDescriptor,
  homeRouterKey
}) {
  _assert({
    controllers,
    loginModuleDescriptor,
    homeRouterKey
  }, _t.interface({
    controllers: Map,
    loginModuleDescriptor: _t.Object,
    homeRouterKey: _t.maybe(_t.String)
  }), '{ controllers, loginModuleDescriptor, homeRouterKey }');

  return function () {
    controllers.set('auth', createAuthController({
      loginModuleDescriptor,
      homeRouterKey
    }));
  };
}

function _assert(x, type, name) {
  if (false) {
    _t.fail = function (message) {
      console.warn(message);
    };
  }

  if (_t.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _t.fail('Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=browser.js.map