function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import t from 'flow-runtime';
export default function createAuthController(_arg) {
  var _t$object$assert = t.object(t.property('loginModuleDescriptor', t.object()), t.property('homeRouterKey', t.nullable(t.string()))).assert(_arg),
      loginModuleDescriptor = _t$object$assert.loginModuleDescriptor,
      _t$object$assert$home = _t$object$assert.homeRouterKey,
      homeRouterKey = _t$object$assert$home === undefined ? 'home' : _t$object$assert$home;

  return {
    login: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (ctx.state.connected) {
                  ctx.redirect(ctx.urlGenerator(homeRouterKey));
                }

                _context.next = 3;
                return ctx.render(loginModuleDescriptor);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function login() {
        return _ref.apply(this, arguments);
      };
    }()
  };
}
//# sourceMappingURL=createAuthController.browser.js.map