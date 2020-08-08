import { IncomingMessage } from 'http';
import { promisify } from 'util';
import { sign } from 'jsonwebtoken';
import Logger from 'nightingale-logger';
import { NodeApplication } from 'alp-types';
import { User } from '../types.d';
import { createFindConnectedAndUser } from './utils/createFindConnectedAndUser';
import { getTokenFromRequest, COOKIE_NAME } from './utils/cookies';
import AuthenticationService, {
  Strategies,
} from './services/authentification/AuthenticationService';
import UserAccountsService from './services/user/UserAccountsService';
import {
  createAuthController,
  AuthController as AuthControllerType,
  AuthHooks,
} from './createAuthController';
import { createRoutes, AuthRoutes as AuthRoutesType } from './createRoutes';
import MongoUsersManager from './MongoUsersManager';
import { AllowedStrategyKeys } from './services/authentification/types';
import { AccountService } from './services/user/types';

export { AuthenticationService };
export { default as MongoUsersManager } from './MongoUsersManager';
export { default as UserAccountGoogleService } from './services/user/UserAccountGoogleService';
export { default as UserAccountSlackService } from './services/user/UserAccountSlackService';
export { authSocketIO } from './authSocketIO';
export { createAuthApolloContext } from './authApolloContext';
export { STATUSES } from './services/user/UserAccountsService';

const logger = new Logger('alp:auth');

const signPromisified: any = promisify(sign);

export type AuthController = AuthControllerType;
export type AuthRoutes = AuthRoutesType;

export default function init<
  U extends User = User,
  StrategyKeys extends AllowedStrategyKeys = 'google'
>({
  homeRouterKey,
  usersManager,
  strategies,
  defaultStrategy,
  strategyToService,
  authHooks,
}: {
  homeRouterKey?: string;
  usersManager: MongoUsersManager<U>;
  strategies: Strategies<StrategyKeys>;
  defaultStrategy?: StrategyKeys;
  strategyToService: Record<StrategyKeys, AccountService<any>>;
  authHooks?: AuthHooks<StrategyKeys>;
}) {
  return (app: NodeApplication) => {
    const userAccountsService = new UserAccountsService(
      usersManager,
      strategyToService,
    );

    const authenticationService = new AuthenticationService(
      app.config,
      strategies,
      userAccountsService,
    );

    const controller = createAuthController({
      usersManager,
      authenticationService,
      homeRouterKey,
      defaultStrategy,
      authHooks,
    });

    app.context.setConnected = async function(
      connected: number | string,
      user: U,
    ): Promise<void> {
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

    app.context.logout = function(): void {
      delete this.state.connected;
      delete this.state.user;
      this.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
    };

    const getConnectedAndUser = createFindConnectedAndUser(
      app.config.get('authentication').get('secretKey'),
      usersManager,
      logger,
    );

    return {
      routes: createRoutes(controller),

      getConnectedAndUserFromRequest: (
        req: IncomingMessage,
      ): ReturnType<typeof getConnectedAndUser> => {
        const token = getTokenFromRequest(req);
        return getConnectedAndUser(req.headers['user-agent'], token);
      },
      getConnectedAndUser,

      middleware: async (ctx: any, next: any) => {
        const token = ctx.cookies.get(COOKIE_NAME);
        const userAgent = ctx.request.headers['user-agent'];
        logger.debug('middleware', { token });

        const setState = (connected: any, user: null | undefined | U): void => {
          ctx.state.connected = connected;
          ctx.state.user = user;
          ctx.sanitizedState.connected = connected;
          ctx.sanitizedState.user = user && usersManager.sanitize(user);
        };

        const notConnected = () => {
          setState(null, null);
          return next();
        };

        const [connected, user] = await getConnectedAndUser(userAgent, token);
        logger.debug('middleware', { connected });

        if (connected == null || user == null) {
          if (token) ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
          return notConnected();
        }

        setState(connected, user);
        return next();
      },
    };
  };
}
