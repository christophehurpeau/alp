/* eslint-disable max-lines */
import type { IncomingMessage } from 'http';
import { promisify } from 'util';
import type { Context } from 'alp-node';
import type { ContextState, NodeApplication } from 'alp-types';
import jsonwebtoken from 'jsonwebtoken';
import { Logger } from 'nightingale-logger';
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
import {
  getTokenFromRequest,
  COOKIE_NAME_TOKEN,
  COOKIE_NAME_STATE,
} from './utils/cookies';
import { createFindLoggedInUser } from './utils/createFindLoggedInUser';

export { default as MongoUsersManager } from './MongoUsersManager';
export { default as UserAccountGoogleService } from './services/user/UserAccountGoogleService';
export { default as UserAccountSlackService } from './services/user/UserAccountSlackService';
export { authSocketIO } from './authSocketIO';
export { createAuthApolloContext } from './authApolloContext';
export { STATUSES } from './services/user/UserAccountsService';

declare module 'alp-types' {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface ContextState {
    loggedInUserId:
      | NonNullable<ContextState['loggedInUser']>['_id']
      | null
      | undefined;
    loggedInUser: User | null | undefined;
  }

  interface ContextSanitizedState {
    loggedInUserId:
      | NonNullable<ContextSanitizedState['loggedInUser']>['_id']
      | null
      | undefined;
    loggedInUser: UserSanitized | null | undefined;
  }

  interface BaseContext {
    setLoggedIn: (
      loggedInUserId: NonNullable<ContextState['loggedInUserId']>,
      loggedInUser: NonNullable<ContextState['loggedInUser']>,
    ) => Promise<void>;
    logout: () => void;
  }
}

const logger = new Logger('alp:auth');

const signPromisified: any = promisify(jsonwebtoken.sign);

export type AuthController = AuthControllerType;
export type AuthRoutes = AuthRoutesType;
export { AuthenticationService } from './services/authentification/AuthenticationService';

export default function init<
  StrategyKeys extends AllowedStrategyKeys = 'google',
  U extends User = User,
  USanitized extends UserSanitized = UserSanitized,
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
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

    app.context.setLoggedIn = async function (
      this: Context,
      loggedInUserId: NonNullable<ContextState['loggedInUser']>['_id'],
      loggedInUser: NonNullable<ContextState['loggedInUser']>,
    ): Promise<void> {
      logger.debug('setLoggedIn', { loggedInUser });
      if (!loggedInUserId) {
        throw new Error('Illegal value for setLoggedIn');
      }

      this.state.loggedInUserId = loggedInUserId;
      this.state.loggedInUser = loggedInUser;

      const token = await signPromisified(
        { loggedInUserId, time: Date.now() },
        this.config
          .get<Map<string, unknown>>('authentication')
          .get('secretKey'),
        {
          algorithm: 'HS512',
          audience: jwtAudience || this.request.headers['user-agent'],
          expiresIn: '30 days',
        },
      );

      const calcExpiresTime = (): number => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date.getTime();
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.cookies.set(COOKIE_NAME_TOKEN, token, {
        httpOnly: true,
        secure: this.config.get('allowHttps'),
      });

      this.cookies.set(
        COOKIE_NAME_STATE,
        JSON.stringify({ loggedInUserId, expiresIn: calcExpiresTime() }),
        {
          httpOnly: false,
          secure: this.config.get('allowHttps'),
        },
      );
    };

    app.context.logout = function (this: Context): void {
      delete this.state.loggedInUserId;
      delete this.state.loggedInUser;
      this.cookies.set(COOKIE_NAME_TOKEN, '', { expires: new Date(1) });
      this.cookies.set(COOKIE_NAME_STATE, '', { expires: new Date(1) });
    };

    const findLoggedInUser = createFindLoggedInUser(
      app.config
        .get<Map<string, unknown>>('authentication')
        .get('secretKey') as string,
      usersManager,
      logger,
    );

    return {
      routes: createRoutes(controller),
      findLoggedInUserFromRequest: (
        req: IncomingMessage,
      ): ReturnType<typeof findLoggedInUser> => {
        const token = getTokenFromRequest(req);
        return findLoggedInUser(
          jwtAudience || req.headers['user-agent'],
          token,
        );
      },
      findLoggedInUser,
      middleware: async <T>(
        ctx: Context,
        next: () => Promise<T> | T,
      ): Promise<T> => {
        const token = ctx.cookies.get(COOKIE_NAME_TOKEN);
        const userAgent = ctx.request.headers['user-agent'];
        logger.debug('middleware', { token });

        const setState = (
          loggedInUserId: U['_id'] | null | undefined,
          loggedInUser: U | null | undefined,
        ): void => {
          ctx.state.loggedInUserId = loggedInUserId;
          ctx.state.user = loggedInUser;
          ctx.sanitizedState.loggedInUserId = loggedInUserId;
          ctx.sanitizedState.loggedInUser =
            loggedInUser && usersManager.sanitize(loggedInUser);
        };

        const [loggedInUserId, loggedInUser] = await findLoggedInUser(
          jwtAudience || userAgent,
          token,
        );
        logger.debug('middleware', { loggedInUserId });

        if (loggedInUserId == null || loggedInUser == null) {
          if (token) {
            ctx.cookies.set(COOKIE_NAME_TOKEN, '', { expires: new Date(1) });
            ctx.cookies.set(COOKIE_NAME_STATE, '', { expires: new Date(1) });
          }
          setState(null, null);
          return next();
        }

        setState(loggedInUserId, loggedInUser);
        return next();
      },
    };
  };
}
