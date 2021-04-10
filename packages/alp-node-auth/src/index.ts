import type { IncomingMessage } from 'http';
import { promisify } from 'util';
import type { Context } from 'alp-node';
import type { ContextState, NodeApplication } from 'alp-types';
import jsonwebtoken from 'jsonwebtoken';
import Logger from 'nightingale-logger';
import type { User, UserSanitized } from '../types.d';
import type MongoUsersManager from './MongoUsersManager';
import type {
  AuthController as AuthControllerType,
  AuthHooks,
} from './createAuthController';
import { createAuthController } from './createAuthController';
import type { AuthRoutes as AuthRoutesType } from './createRoutes';
import { createRoutes } from './createRoutes';
import type { Strategies } from './services/authentification/AuthenticationService';
import { AuthenticationService } from './services/authentification/AuthenticationService';
import type { AllowedStrategyKeys } from './services/authentification/types';
import UserAccountsService from './services/user/UserAccountsService';
import type { AccountService } from './services/user/types';
import { getTokenFromRequest, COOKIE_NAME } from './utils/cookies';
import { createFindConnectedAndUser } from './utils/createFindConnectedAndUser';

export { AuthenticationService };
export { default as MongoUsersManager } from './MongoUsersManager';
export { default as UserAccountGoogleService } from './services/user/UserAccountGoogleService';
export { default as UserAccountSlackService } from './services/user/UserAccountSlackService';
export { authSocketIO } from './authSocketIO';
export { createAuthApolloContext } from './authApolloContext';
export { STATUSES } from './services/user/UserAccountsService';

declare module 'alp-types' {
  interface ContextState {
    connected: NonNullable<ContextState['user']>['_id'] | null | undefined;
    user: User | null | undefined;
  }

  interface ContextSanitizedState {
    connected:
      | NonNullable<ContextSanitizedState['user']>['_id']
      | null
      | undefined;
    user: UserSanitized | null | undefined;
  }

  interface BaseContext {
    setConnected: (
      connected: NonNullable<ContextState['user']>['_id'],
      user: NonNullable<ContextState['user']>,
    ) => Promise<void>;
    logout: () => void;
  }
}

const logger = new Logger('alp:auth');

const signPromisified: any = promisify(jsonwebtoken.sign);

export type AuthController = AuthControllerType;
export type AuthRoutes = AuthRoutesType;

export default function init<
  StrategyKeys extends AllowedStrategyKeys = 'google',
  U extends User = User,
  USanitized extends UserSanitized = UserSanitized
>({
  homeRouterKey,
  usersManager,
  strategies,
  defaultStrategy,
  strategyToService,
  authHooks,
  jwtAudience,
}: {
  homeRouterKey?: string;
  usersManager: MongoUsersManager<U, USanitized>;
  strategies: Strategies<StrategyKeys>;
  defaultStrategy?: StrategyKeys;
  strategyToService: Record<StrategyKeys, AccountService<any>>;
  authHooks?: AuthHooks<StrategyKeys>;
  jwtAudience?: string;
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

    app.context.setConnected = async function (
      this: Context,
      connected: NonNullable<ContextState['user']>['_id'],
      user: NonNullable<ContextState['user']>,
    ): Promise<void> {
      logger.debug('setConnected', { connected });
      if (!connected) {
        throw new Error('Illegal value for setConnected');
      }

      this.state.connected = connected;
      this.state.user = user;

      const token = await signPromisified(
        { connected, time: Date.now() },
        this.config
          .get<Map<string, unknown>>('authentication')
          .get('secretKey'),
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

    app.context.logout = function (this: Context): void {
      delete this.state.connected;
      delete this.state.user;
      this.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
    };

    const getConnectedAndUser = createFindConnectedAndUser(
      app.config
        .get<Map<string, unknown>>('authentication')
        .get('secretKey') as string,
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

      middleware: async <T>(
        ctx: Context,
        next: () => T | Promise<T>,
      ): Promise<T> => {
        const token = ctx.cookies.get(COOKIE_NAME);
        const userAgent = ctx.request.headers['user-agent'];
        logger.debug('middleware', { token });

        const setState = (
          connected: U['_id'] | null | undefined,
          user: U | null | undefined,
        ): void => {
          ctx.state.connected = connected;
          ctx.state.user = user;
          ctx.sanitizedState.connected = connected;
          ctx.sanitizedState.user = user && usersManager.sanitize(user);
        };

        const [connected, user] = await getConnectedAndUser(
          jwtAudience || userAgent,
          token,
        );
        logger.debug('middleware', { connected });

        if (connected == null || user == null) {
          if (token) ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
          setState(null, null);
          return next();
        }

        setState(connected, user);
        return next();
      },
    };
  };
}
