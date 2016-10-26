import createAuthController from './controllers/createAuthController.browser';

export { default as routes } from './routes';

export default function init(_ref) {
  var controllers = _ref.controllers,
      loginModuleDescriptor = _ref.loginModuleDescriptor,
      homeRouterKey = _ref.homeRouterKey;

  return app => {
    controllers.set('auth', createAuthController({
      loginModuleDescriptor,
      homeRouterKey
    }));
  };
}
//# sourceMappingURL=browser.js.map