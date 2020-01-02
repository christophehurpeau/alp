import { NodeApplication } from 'alp-types';
import { User } from '../types.d';
import AuthenticationService, { Strategies } from './services/authentification/AuthenticationService';
import { AuthController as AuthControllerType, AuthHooks } from './createAuthController';
import { AuthRoutes as AuthRoutesType } from './createRoutes';
import MongoUsersManager from './MongoUsersManager';
import { AllowedStrategyKeys } from './services/authentification/types';
import { AccountService } from './services/user/types';
export { AuthenticationService };
export { default as MongoUsersManager } from './MongoUsersManager';
export { default as UserAccountGoogleService } from './services/user/UserAccountGoogleService';
export { default as UserAccountSlackService } from './services/user/UserAccountSlackService';
export { authSocketIO } from './authSocketIO';
export { STATUSES } from './services/user/UserAccountsService';
export declare const COOKIE_NAME = "connectedUser";
export declare type AuthController = AuthControllerType;
export declare type AuthRoutes = AuthRoutesType;
export default function init<U extends User = User, StrategyKeys extends AllowedStrategyKeys = 'google'>({ homeRouterKey, usersManager, strategies, defaultStrategy, strategyToService, authHooks, }: {
    homeRouterKey?: string;
    usersManager: MongoUsersManager<U>;
    strategies: Strategies<StrategyKeys>;
    defaultStrategy?: StrategyKeys;
    strategyToService: Record<StrategyKeys, AccountService<any>>;
    authHooks?: AuthHooks<StrategyKeys>;
}): (app: NodeApplication) => {
    routes: AuthRoutesType;
    getConnectedAndUser: (userAgent: string, token?: string | undefined) => Promise<[string | number | null, U | null | undefined]>;
    middleware: (ctx: any, next: any) => Promise<any>;
};
//# sourceMappingURL=index.d.ts.map