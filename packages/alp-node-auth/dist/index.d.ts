import type { IncomingMessage } from 'http';
import type { ContextUser, NodeApplication } from 'alp-types';
import type { User, UserSanitized } from '../types.d';
import type MongoUsersManager from './MongoUsersManager';
import type { AuthController as AuthControllerType, AuthHooks } from './createAuthController';
import type { AuthRoutes as AuthRoutesType } from './createRoutes';
import type { Strategies } from './services/authentification/AuthenticationService';
import { AuthenticationService } from './services/authentification/AuthenticationService';
import type { AllowedStrategyKeys } from './services/authentification/types';
import type { AccountService } from './services/user/types';
export { AuthenticationService };
export { default as MongoUsersManager } from './MongoUsersManager';
export { default as UserAccountGoogleService } from './services/user/UserAccountGoogleService';
export { default as UserAccountSlackService } from './services/user/UserAccountSlackService';
export { authSocketIO } from './authSocketIO';
export { createAuthApolloContext } from './authApolloContext';
export { STATUSES } from './services/user/UserAccountsService';
declare module 'alp-types' {
    type ContextUser = User;
    type ContextConnected = ContextUser['_id'];
    type ContextUserSanitized = UserSanitized;
    interface ContextState {
        connected: ContextConnected | null | undefined;
        user: ContextUser | null | undefined;
    }
    interface ContextSanitizedState {
        connected: ContextConnected | null | undefined;
        user: ContextUserSanitized | null | undefined;
    }
    interface BaseContext {
        setConnected: (connected: ContextConnected, user: ContextUser) => void;
        logout: () => void;
    }
}
export declare type AuthController = AuthControllerType;
export declare type AuthRoutes = AuthRoutesType;
export default function init<StrategyKeys extends AllowedStrategyKeys = 'google'>({ homeRouterKey, usersManager, strategies, defaultStrategy, strategyToService, authHooks, }: {
    homeRouterKey?: string;
    usersManager: MongoUsersManager<ContextUser>;
    strategies: Strategies<StrategyKeys>;
    defaultStrategy?: StrategyKeys;
    strategyToService: Record<StrategyKeys, AccountService<any>>;
    authHooks?: AuthHooks<StrategyKeys>;
}): (app: NodeApplication) => {
    routes: AuthRoutesType;
    getConnectedAndUserFromRequest: (req: IncomingMessage) => Promise<[string | number | null, User | null | undefined]>;
    getConnectedAndUser: import("./utils/createFindConnectedAndUser").FindConnectedAndUser<User>;
    middleware: <T>(ctx: any, next: () => T | Promise<T>) => Promise<T>;
};
//# sourceMappingURL=index.d.ts.map