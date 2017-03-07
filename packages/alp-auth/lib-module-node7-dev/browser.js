import createAuthController from './controllers/createAuthController.browser';

import t from 'flow-runtime';
export { default as routes } from './routes';

export default function init({
  controllers,
  loginModuleDescriptor,
  homeRouterKey
}) {
  t.param('arguments[0]', t.object(t.property('controllers', t.ref('Map')), t.property('loginModuleDescriptor', t.object()), t.property('homeRouterKey', t.nullable(t.string())))).assert(arguments[0]);

  return () => {
    controllers.set('auth', createAuthController({
      loginModuleDescriptor,
      homeRouterKey
    }));
  };
}
//# sourceMappingURL=browser.js.map