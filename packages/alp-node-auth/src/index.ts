import { promisify } from 'util';
import { sign, verify } from 'jsonwebtoken';
import Logger from 'nightingale-logger';
import { NodeApplication } from 'alp-types';
import { Option } from 'cookies';
import AuthenticationService, {
  Strategies,
} from './services/authentification/AuthenticationService';
import UserAccountsService from './services/user/UserAccountsService';
import {
  createAuthController,
  AuthController as AuthControllerType,
} from './createAuthController';
import { createRoutes } from './createRoutes';
import MongoUsersManager from './MongoUsersManager';

export { default as MongoUsersManager } from './MongoUsersManager';
export { STATUSES } from './services/user/UserAccountsService';

const COOKIE_NAME = 'connectedUser';
const logger = new Logger('alp:auth');

const signPromisified: any = promisify(sign);
const verifyPromisified: any = promisify(verify);

interface ExtendedNodeApplication extends NodeApplication {
  websocket?: any;
}

export type AuthController = AuthControllerType;

export default function init({
  usersManager,
  strategies,
  homeRouterKey,
}: {
  homeRouterKey?: string;
  strategies: Strategies;
  usersManager: MongoUsersManager;
}) {
  return (
    app: ExtendedNodeApplication,
    options?: Pick<Option, Exclude<keyof Option, 'secure'>>,
  ) => {
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

    app.context.setConnected = async function(
      connected: number | string,
      user: Object,
    ) {
      logger.debug('setConnected', { connected });
      if (!connected) {
        throw new Error('Illegal value for setConnected');
      }

      this.state.connected = connected;
      this.state.user = user;

      const token = await signPromisified(
        { connected, time: Date.now() },
        this.config.get('authentication').get('secretKey'),
        {
          algorithm: 'HS512',
          audience: this.request.headers['user-agent'],
          expiresIn: '30 days',
        },
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

    const decodeJwt = async (token: string, userAgent: string) => {
      const result = await verifyPromisified(
        token,
        app.config.get('authentication').get('secretKey'),
        {
          algorithm: 'HS512',
          audience: userAgent,
        },
      );
      return result && result.connected;
    };

    if (app.websocket) {
      logger.debug('app has websocket');
      // eslint-disable-next-line global-require, typescript/no-var-requires
      const Cookies = require('cookies');

      const users = new Map();
      app.websocket.users = users;

      app.websocket.use(async (socket: any, next: any) => {
        const handshakeData = socket.request;
        const cookies = new Cookies(handshakeData, null, {
          ...options,
          secure: true,
        });
        const token = cookies.get(COOKIE_NAME);
        logger.debug('middleware websocket', { token });

        if (!token) return next();

        let connected;
        try {
          connected = await decodeJwt(
            token,
            handshakeData.headers['user-agent'],
          );
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
      routes: createRoutes(controller),

      middleware: async (ctx: any, next: any) => {
        const token = ctx.cookies.get(COOKIE_NAME);
        logger.debug('middleware', { token });

        const setState = (connected: any, user: any) => {
          ctx.state.connected = connected;
          ctx.state.user = user;
          ctx.sanitizedState.connected = connected;
          ctx.sanitizedState.user = user && usersManager.sanitize(user);
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
