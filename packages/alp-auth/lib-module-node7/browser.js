import createAuthController from './controllers/createAuthController.browser';

export { default as routes } from './routes';

export default function init({
  controllers,
  loginModuleDescriptor,
  homeRouterKey
}) {
  return () => {
    controllers.set('auth', createAuthController({
      loginModuleDescriptor,
      homeRouterKey
    }));
  };
}
//# sourceMappingURL=browser.js.map