import _t from 'tcomb-forked';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import AuthenticationService from '../services/AuthenticationService';

export default function createAuthController(_ref) {
  var usersManager = _ref.usersManager;
  var authenticationService = _ref.authenticationService;
  var loginModuleDescriptor = _ref.loginModuleDescriptor;
  var _ref$homeRouterKey = _ref.homeRouterKey;
  var homeRouterKey = _ref$homeRouterKey === undefined ? 'home' : _ref$homeRouterKey;

  _assert({
    usersManager,
    authenticationService,
    loginModuleDescriptor,
    homeRouterKey
  }, _t.interface({
    usersManager: _t.Object,
    authenticationService: AuthenticationService,
    loginModuleDescriptor: _t.Object,
    homeRouterKey: _t.maybe(_t.String)
  }), '{ usersManager, authenticationService, loginModuleDescriptor, homeRouterKey }');

  return {
    login(ctx) {
      return _asyncToGenerator(function* () {
        if (ctx.state.connected) {
          ctx.redirect(ctx.urlGenerator(homeRouterKey));
        }

        var strategy = ctx.namedParam('strategy');
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

        var strategy = ctx.namedParam('strategy');
        ctx.assert(strategy);

        var connectedUser = yield authenticationService.accessResponse(ctx, strategy);
        var keyPath = usersManager.store.keyPath;
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
//# sourceMappingURL=createAuthController.server.js.map