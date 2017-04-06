import createAuthController from './controllers/createAuthController.browser';

import t from 'flow-runtime';
export { default as routes } from './routes';

export default function init(_arg) {
  var _t$object$assert = t.object(t.property('controllers', t.ref('Map')), t.property('loginModuleDescriptor', t.object()), t.property('homeRouterKey', t.nullable(t.string()))).assert(_arg),
      controllers = _t$object$assert.controllers,
      loginModuleDescriptor = _t$object$assert.loginModuleDescriptor,
      homeRouterKey = _t$object$assert.homeRouterKey;

  return function () {
    controllers.set('auth', createAuthController({
      loginModuleDescriptor: loginModuleDescriptor,
      homeRouterKey: homeRouterKey
    }));
  };
}
//# sourceMappingURL=browser.js.map