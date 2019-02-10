import { promisify } from 'util';
import { sign } from 'jsonwebtoken';
import Logger from 'nightingale-logger';
import { NodeApplication } from 'alp-types';
import { User } from '../types.d';
import AuthenticationService, {
  Strategies,
} from './services/authentification/AuthenticationService';
import UserAccountsService from './services/user/UserAccountsService';
import {
  createAuthController,
  AuthController as AuthControllerType,
} from './createAuthController';
import { createRoutes, AuthRoutes as AuthRoutesType } from './createRoutes';
import MongoUsersManager from './MongoUsersManager';
import { createDecodeJWT } from './utils/createDecodeJWT';

export { default as MongoUsersManager } from './MongoUsersManager';
export { authSocketIO } from './authSocketIO';
export { STATUSES } from './services/user/UserAccountsService';

const COOKIE_NAME = 'connectedUser';
const logger = new Logger('alp:auth');

const signPromisified: any = promisify(sign);

export type AuthController = AuthControllerType;
export type AuthRoutes = AuthRoutesType;

export default function init<U extends User = User>({
  usersManager,
  strategies,
  homeRouterKey,
}: {
  homeRouterKey?: string;
  strategies: Strategies;
  usersManager: MongoUsersManager<U>;
}) {
  return (app: NodeApplication) => {
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
      user: U,
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

    const decodeJwt = createDecodeJWT(
      app.config.get('authentication').get('secretKey'),
    );
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
