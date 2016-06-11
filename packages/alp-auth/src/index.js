import { sign, verify } from 'jsonwebtoken';
import promiseCallback from 'promise-callback-factory';
import Logger from 'nightingale-logger';
import UsersManager from './models/user/UsersManager';

export { default as createAuthController } from './controllers/authController';
export { UsersManager };
export { default as AuthenticationService } from './services/AuthenticationService';
export { default as UserAccountsService } from './services/user/UserAccountsService';

const COOKIE_NAME = 'connectedUser';
const logger = new Logger('alp-auth');

export function init(app, usersManager: UsersManager) {
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
}


export function middleware(usersManager: UsersManager) {
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
}
