'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAuthController;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _AuthenticationService = require('../services/AuthenticationService');

var _AuthenticationService2 = _interopRequireDefault(_AuthenticationService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function createAuthController(_ref) {
  var _assert2 = _assert(_ref, _tcombForked2.default.interface({
    usersManager: _tcombForked2.default.Object,
    authenticationService: _AuthenticationService2.default,
    loginModuleDescriptor: _tcombForked2.default.Object,
    homeRouterKey: _tcombForked2.default.maybe(_tcombForked2.default.String)
  }), '{ usersManager, authenticationService, loginModuleDescriptor, homeRouterKey = \'home\' }');

  let usersManager = _assert2.usersManager;
  let authenticationService = _assert2.authenticationService;
  let loginModuleDescriptor = _assert2.loginModuleDescriptor;
  var _assert2$homeRouterKe = _assert2.homeRouterKey;
  let homeRouterKey = _assert2$homeRouterKe === undefined ? 'home' : _assert2$homeRouterKe;

  _assert({
    usersManager,
    authenticationService,
    loginModuleDescriptor,
    homeRouterKey
  }, _tcombForked2.default.interface({
    usersManager: _tcombForked2.default.Object,
    authenticationService: _AuthenticationService2.default,
    loginModuleDescriptor: _tcombForked2.default.Object,
    homeRouterKey: _tcombForked2.default.maybe(_tcombForked2.default.String)
  }), '{ usersManager, authenticationService, loginModuleDescriptor, homeRouterKey }');

  return {
    login(ctx) {
      return _asyncToGenerator(function* () {
        if (ctx.state.connected) {
          ctx.redirect(ctx.urlGenerator(homeRouterKey));
        }

        const strategy = ctx.namedParam('strategy');
        if (strategy) {
          yield authenticationService.redirectAuthUrl(ctx, strategy);
          return;
        }

        yield ctx.render(loginModuleDescriptor);
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
        const keyPath = _assert(usersManager.store.keyPath, _tcombForked2.default.String, 'keyPath');
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

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }

    return type(x);
  }

  if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=createAuthController.server.js.map