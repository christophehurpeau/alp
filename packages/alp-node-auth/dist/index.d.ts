import type { IncomingMessage } from 'http';
import type { Context } from 'alp-node';
import type { NodeApplication } from 'alp-types';
import type { User, UserSanitized } from '../types.d';
import type MongoUsersManager from './MongoUsersManager';
import type { AuthController as AuthControllerType, AuthHooks } from './createAuthController';
import type { AuthRoutes as AuthRoutesType } from './createRoutes';
import type { Strategies } from './services/authentification/AuthenticationService';
import type { AllowedStrategyKeys } from './services/authentification/types';
import type { AccountService } from './services/user/types';
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
        connected: NonNullable<ContextSanitizedState['user']>['_id'] | null | undefined;
        user: UserSanitized | null | undefined;
    }
    interface BaseContext {
        setConnected: (connected: NonNullable<ContextState['user']>['_id'], user: NonNullable<ContextState['user']>) => Promise<void>;
        logout: () => void;
    }
}
export declare type AuthController = AuthControllerType;
export declare type AuthRoutes = AuthRoutesType;
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
    getConnectedAndUserFromRequest: (req: IncomingMessage) => Promise<[U["_id"] | null | undefined, U | null | undefined]>;
    getConnectedAndUser: import("./utils/createFindConnectedAndUser").FindConnectedAndUser<U>;
    middleware: <T>(ctx: Context, next: () => T | Promise<T>) => Promise<T>;
};
//# sourceMappingURL=index.d.ts.map