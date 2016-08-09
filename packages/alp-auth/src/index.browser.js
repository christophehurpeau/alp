import createAuthController from './controllers/createAuthController.browser';

export { default as routes } from './routes';

export default function init({
    controllers,
    loginModuleDescriptor,
    homeRouterKey,
}: {
    controllers: Map,
    loginModuleDescriptor: Object,
    homeRouterKey: ?string,
}) {
    return app => {
        controllers.set('auth', createAuthController({
            loginModuleDescriptor,
            homeRouterKey,
        }));
    };
}
