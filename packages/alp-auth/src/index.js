import { sign, verify } from 'jsonwebtoken';
import promiseCallback from 'promise-callback-factory';
import Logger from 'nightingale-logger/src';
import abstractUsersManager from './models/user/abstractUsersManager';
import mongoUsersManager from './models/user/mongoUsersManager';
import rethinkUsersManager from './models/user/rethinkUsersManager';
import AuthenticationService from './services/AuthenticationService';
import UserAccountsService from './services/user/UserAccountsService';
import createAuthController from './createAuthController';

export { abstractUsersManager, mongoUsersManager, rethinkUsersManager };
export * from './models/user/types';

const COOKIE_NAME = 'connectedUser';
const logger = new Logger('alp:auth');

export default function init({
  usersManager,
  strategies,
  homeRouterKey,
}: {
  homeRouterKey?: ?string,
  strategies: Object,
  usersManager: Object,
}) {
  return app => {
    const userAccountsService = new UserAccountsService(usersManager);

    const authenticationService = new AuthenticationService(
      app.config,
      strategies,
      userAccountsService,
    );

    const controller = createAuthController({
      usersManager,
      authenticationService,
      homeRouterKey,
    });

    app.reduxReducers.user = (state = null) => state;
    app.reduxReducers.connected = (state = null) => state;

    app.context.setConnected = async function(connected: number | string, user: Object) {
      logger.debug('setConnected', { connected });
      if (!connected) {
        throw new Error('Illegal value for setConnected');
      }

      this.state.connected = connected;
      this.state.user = user;

      const token = await promiseCallback(done =>
        sign(
          { connected, time: Date.now() },
          this.config.get('authentication').get('secretKey'),
          {
            algorithm: 'HS512',
            audience: this.request.headers['user-agent'],
            expiresIn: '30 days',
          },
          done,
        ),
      );

      this.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: this.config.get('allowHttps'),
      });
    };

    app.context.logout = function() {
      delete this.state.connected;
      delete this.state.user;
      this.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
    };

    const decodeJwt = (token, userAgent) => {
      const result = verify(token, app.config.get('authentication').get('secretKey'), {
        algorithm: 'HS512',
        audience: userAgent,
      });
      return result && result.connected;
    };

    if (app.websocket) {
      logger.debug('app has websocket');
      // eslint-disable-next-line global-require
      const Cookies = require('cookies');

      const users = new Map();
      app.websocket.users = users;

      app.websocket.use(async (socket, next) => {
        const handshakeData = socket.request;
        const cookies = new Cookies(handshakeData, null, { keys: app.keys });
        const token = cookies.get(COOKIE_NAME);
        logger.debug('middleware websocket', { token });

        if (!token) return next();

        let connected;
        try {
          connected = await decodeJwt(token, handshakeData.headers['user-agent']);
        } catch (err) {
          logger.info('failed to verify authentication', { err });
          return next();
        }
        logger.debug('middleware websocket', { connected });

        if (!connected) return next();

        const user = await usersManager.findConnected(connected);

        if (!user) return next();

        socket.user = user;
        users.set(socket.client.id, user);

        socket.on('disconnected', () => users.delete(socket.client.id));

        await next();
      });
    }

    return {
      routes: {
        login: [
          '/login/:strategy',
          segment => {
            segment.add('/response', controller.loginResponse, 'loginResponse');
            segment.defaultRoute(controller.login, 'login');
          },
        ],
        logout: ['/logout', controller.logout],
      },

      middleware: async (ctx, next) => {
        const token = ctx.cookies.get(COOKIE_NAME);
        logger.debug('middleware', { token });

        const setState = (connected, user) => {
          ctx.state.connected = connected;
          ctx.state.user = user;
          if (ctx.reduxInitialContext) {
            ctx.reduxInitialContext.connected = connected;
            ctx.reduxInitialContext.user = user && usersManager.transformForBrowser(user);
          }
        };

        const notConnected = () => {
          setState(null, null);
          return next();
        };

        if (!token) return notConnected();

        let connected;
        try {
          connected = await decodeJwt(token, ctx.request.headers['user-agent']);
        } catch (err) {
          logger.info('failed to verify authentification', { err });
          ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
          return notConnected();
        }
        logger.debug('middleware', { connected });

        if (!connected) return notConnected();

        const user = await usersManager.findConnected(connected);

        if (!user) {
          ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
          return notConnected();
        }

        setState(connected, user);
        return next();
      },
    };
  };
}
