function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import AuthenticationService from '../services/AuthenticationService';

import t from 'flow-runtime';
export default function createAuthController(_arg) {
  var _t$object$assert = t.object(t.property('usersManager', t.object()), t.property('authenticationService', t.ref(AuthenticationService)), t.property('loginModuleDescriptor', t.object()), t.property('homeRouterKey', t.nullable(t.string()))).assert(_arg),
      usersManager = _t$object$assert.usersManager,
      authenticationService = _t$object$assert.authenticationService,
      loginModuleDescriptor = _t$object$assert.loginModuleDescriptor,
      _t$object$assert$home = _t$object$assert.homeRouterKey,
      homeRouterKey = _t$object$assert$home === undefined ? 'home' : _t$object$assert$home;

  return {
    login: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
        var strategy;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (ctx.state.connected) {
                  ctx.redirect(ctx.urlGenerator(homeRouterKey));
                }

                strategy = ctx.namedParam('strategy');

                if (!strategy) {
                  _context.next = 6;
                  break;
                }

                _context.next = 5;
                return authenticationService.redirectAuthUrl(ctx, strategy);

              case 5:
                return _context.abrupt('return');

              case 6:
                _context.next = 8;
                return ctx.render(loginModuleDescriptor);

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function login() {
        return _ref.apply(this, arguments);
      };
    }(),
    loginResponse: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
        var strategy, connectedUser, keyPath;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (ctx.state.connected) {
                  ctx.redirect(ctx.urlGenerator(homeRouterKey));
                }

                strategy = ctx.namedParam('strategy');

                ctx.assert(strategy);

                _context2.next = 5;
                return authenticationService.accessResponse(ctx, strategy);

              case 5:
                connectedUser = _context2.sent;
                keyPath = t.string().assert(usersManager.store.keyPath);
                _context2.next = 9;
                return ctx.setConnected(connectedUser[keyPath], connectedUser);

              case 9:
                ctx.state.connected = connectedUser;
                _context2.next = 12;
                return ctx.redirect(ctx.urlGenerator(homeRouterKey));

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function loginResponse() {
        return _ref2.apply(this, arguments);
      };
    }(),
    logout: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                ctx.logout();
                _context3.next = 3;
                return ctx.redirect(ctx.urlGenerator(homeRouterKey));

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function logout() {
        return _ref3.apply(this, arguments);
      };
    }()
  };
}
//# sourceMappingURL=createAuthController.server.js.map