function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

export default function createAuthController(_ref) {
  var loginModuleDescriptor = _ref.loginModuleDescriptor;
  var _ref$homeRouterKey = _ref.homeRouterKey;
  var homeRouterKey = _ref$homeRouterKey === undefined ? 'home' : _ref$homeRouterKey;

  return {
    login: function login(ctx) {
      var _this = this;

      return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
        }, _callee, _this);
      }))();
    }
  };
}
//# sourceMappingURL=createAuthController.browser.js.map