function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import t from 'flow-runtime';
export default function createAuthController(_arg) {
  let {
    loginModuleDescriptor,
    homeRouterKey = 'home'
  } = t.object(t.property('loginModuleDescriptor', t.object()), t.property('homeRouterKey', t.nullable(t.string()))).assert(_arg);

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
//# sourceMappingURL=createAuthController.browser.js.map