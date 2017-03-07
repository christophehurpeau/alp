function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import t from 'flow-runtime';
export default function createAuthController(_ref) {
  var loginModuleDescriptor = _ref.loginModuleDescriptor,
      _ref$homeRouterKey = _ref.homeRouterKey,
      homeRouterKey = _ref$homeRouterKey === undefined ? 'home' : _ref$homeRouterKey;
  t.param('arguments[0]', t.object(t.property('loginModuleDescriptor', t.object()), t.property('homeRouterKey', t.nullable(t.string())))).assert(arguments[0]);

  return {
    login: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
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
        return _ref2.apply(this, arguments);
      };
    }()
  };
}
//# sourceMappingURL=createAuthController.browser.js.map