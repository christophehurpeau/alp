import { sign, verify } from 'jsonwebtoken';
import promiseCallback from 'promise-callback-factory';
import Logger from 'nightingale-logger';
import UsersManager from './models/user/UsersManager';
import AuthenticationService from './services/AuthenticationService';
import UserAccountsService from './services/user/UserAccountsService';
import createAuthController from './controllers/createAuthController.server';

export { UsersManager };
export { default as routes } from './routes';

const COOKIE_NAME = 'connectedUser';
const logger = new Logger('alp-auth');

export default function init({
    controllers,
    usersManager,
    strategies,
    loginModuleDescriptor,
    homeRouterKey,
}: {
    controllers: Map,
    usersManager: UsersManager,
    strategies: Object,
    loginModuleDescriptor: Object,
    homeRouterKey: ?string,
}) {
    return app => {
        const userAccountsService = new UserAccountsService(usersManager);

        const authenticationService = new AuthenticationService(
            app.config,
            strategies,
            userAccountsService
        );

        controllers.set('auth', createAuthController({
            authenticationService,
            loginModuleDescriptor,
            homeRouterKey,
        }));

        app.context.setConnected = async function (connected: number|string, user: Object) {
            logger.debug('setConnected', { connected });
            if (!connected) {
                throw new Error('Illegal value for setConnected');
            }

            this.state.connected = connected;
            this.state.user = user;

            const token = await promiseCallback(done => sign(
                { connected, time: Date.now() },
                this.config.get('authentication').get('secretKey'),
                {
                    algorithm: 'HS512',
                    audience: this.request.headers['user-agent'],
                    expiresIn: '30 days',
                },
                done
            ));

            this.cookies.set(COOKIE_NAME, token, {
                httpOnly: true,
                secure: this.config.get('allowHttps'),
            });
        };

        app.context.logout = function () {
            delete this.state.connected;
            delete this.state.user;
            this.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
        };

        app.registerBrowserStateTransformers((initialBrowserState, ctx) => {
            if (ctx.state.connected) {
                initialBrowserState.connected = ctx.state.connected;
                initialBrowserState.user = usersManager.transformForBrowser(ctx.state.user);
            }
        });

        return async (ctx, next) => {
            let token = ctx.cookies.get(COOKIE_NAME);
            logger.debug('middleware', { token });
            if (!token) return await next();

            let connected;
            try {
                let decoded = await verify(token, ctx.config.get('authentication').get('secretKey'), {
                    algorithm: 'HS512',
                    audience: ctx.request.headers['user-agent'],
                });
                connected = decoded.connected;
            } catch (err) {
                logger.info('failed to verify authentification', { err });
                ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
                return await next();
            }
            logger.debug('middleware', { connected });

            if (!connected) return await next();

            const user = await usersManager.findConnected(connected);

            if (!user) {
                ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
                return await next();
            }

            ctx.state.connected = connected;
            ctx.state.user = user;

            await next();
        };
    };
}
