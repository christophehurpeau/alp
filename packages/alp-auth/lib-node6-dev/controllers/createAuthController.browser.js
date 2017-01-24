'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAuthController;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function createAuthController({
  loginModuleDescriptor,
  homeRouterKey = 'home'
}) {
  _assert({
    loginModuleDescriptor,
    homeRouterKey
  }, _tcombForked2.default.interface({
    loginModuleDescriptor: _tcombForked2.default.Object,
    homeRouterKey: _tcombForked2.default.maybe(_tcombForked2.default.String)
  }), '{ loginModuleDescriptor, homeRouterKey = \'home\' }');

  return {
    login(ctx) {
      return _asyncToGenerator(function* () {
        if (ctx.state.connected) {
          ctx.redirect(ctx.urlGenerator(homeRouterKey));
        }

        yield ctx.render(loginModuleDescriptor);
      })();
    }
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
//# sourceMappingURL=createAuthController.browser.js.map