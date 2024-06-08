/// <reference types="node" />
import type { IncomingMessage } from 'node:http';
import type { Context, NodeApplication } from 'alp-node';
import type MongoUsersManager from './MongoUsersManager';
import type { AuthController as AuthControllerType, AuthHooks } from './createAuthController';
import type { AuthRoutes as AuthRoutesType } from './createRoutes';
import type { Strategies } from './services/authentification/AuthenticationService';
import type { AllowedStrategyKeys } from './services/authentification/types';
import type { AccountService } from './services/user/types';
import type { User, UserSanitized } from './types';
export { default as MongoUsersManager } from './MongoUsersManager';
export { default as UserAccountGoogleService } from './services/user/UserAccountGoogleService';
export { default as UserAccountSlackService } from './services/user/UserAccountSlackService';
export { authSocketIO } from './authSocketIO';
export { createAuthApolloContext } from './authApolloContext';
export { STATUSES } from './services/user/UserAccountsService';
export * from './types';
declare module 'alp-node' {
    interface ContextState {
        loggedInUserId: NonNullable<ContextState['loggedInUser']>['_id'] | null | undefined;
        loggedInUser: User | null | undefined;
    }
    interface ContextSanitizedState {
        loggedInUserId: NonNullable<ContextSanitizedState['loggedInUser']>['_id'] | null | undefined;
        loggedInUser: UserSanitized | null | undefined;
    }
    interface BaseContext {
        setLoggedIn: (loggedInUserId: NonNullable<ContextState['loggedInUserId']>, loggedInUser: NonNullable<ContextState['loggedInUser']>) => Promise<void>;
        logout: () => void;
    }
}
export type AuthController = AuthControllerType;
export type AuthRoutes = AuthRoutesType;
export { AuthenticationService } from './services/authentification/AuthenticationService';
export default function init<StrategyKeys extends AllowedStrategyKeys = 'google', U extends User = User, USanitized extends UserSanitized = UserSanitized>({ homeRouterKey, usersManager, strategies, defaultStrategy, strategyToService, authHooks, jwtAudience, }: {
    homeRouterKey?: string;
    usersManager: MongoUsersManager<U, USanitized>;
    strategies: Strategies<StrategyKeys>;
    defaultStrategy?: StrategyKeys;
    strategyToService: Record<StrategyKeys, AccountService<any>>;
    authHooks?: AuthHooks<StrategyKeys>;
    jwtAudience?: string;
}): (app: NodeApplication) => {
    routes: AuthRoutesType;
    findLoggedInUserFromRequest: (req: IncomingMessage) => Promise<[U["_id"] | null | undefined, U | null | undefined]>;
    findLoggedInUser: import("./utils/createFindLoggedInUser").FindLoggedInUser<U>;
    middleware: <T>(ctx: Context, next: () => Promise<T> | T) => Promise<T>;
};
//# sourceMappingURL=index.d.ts.map