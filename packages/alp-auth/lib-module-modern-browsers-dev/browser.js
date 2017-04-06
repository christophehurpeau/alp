import createAuthController from './controllers/createAuthController.browser';

import t from 'flow-runtime';
export { default as routes } from './routes';

export default function init(_arg) {
  let {
    controllers,
    loginModuleDescriptor,
    homeRouterKey
  } = t.object(t.property('controllers', t.ref('Map')), t.property('loginModuleDescriptor', t.object()), t.property('homeRouterKey', t.nullable(t.string()))).assert(_arg);

  return function () {
    controllers.set('auth', createAuthController({
      loginModuleDescriptor,
      homeRouterKey
    }));
  };
}
//# sourceMappingURL=browser.js.map