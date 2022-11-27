/// <reference types="koa" />
import type { Context } from 'alp-node';
import 'alp-router';
import type { User, UserSanitized } from '../types.d';
import type MongoUsersManager from './MongoUsersManager';
import type { AuthenticationService, AccessResponseHooks } from './services/authentification/AuthenticationService';
import type { AllowedStrategyKeys, AllowedMapParamsStrategy } from './services/authentification/types';
export interface CreateAuthControllerParams<StrategyKeys extends AllowedStrategyKeys, U extends User = User, USanitized extends UserSanitized = UserSanitized> {
    authenticationService: AuthenticationService<StrategyKeys, U, UserSanitized>;
    homeRouterKey?: string;
    usersManager: MongoUsersManager<U, USanitized>;
    defaultStrategy?: StrategyKeys;
    authHooks?: AuthHooks<StrategyKeys>;
}
export interface AuthController {
    login: (ctx: Context) => Promise<void>;
    addScope: (ctx: Context) => Promise<void>;
    response: (ctx: Context) => Promise<void>;
    logout: (ctx: Context) => Promise<void>;
}
declare type OptionalRecord<K extends keyof any, T> = {
    [P in K]?: T;
};
export interface AuthHooks<StrategyKeys extends AllowedStrategyKeys> extends AccessResponseHooks<StrategyKeys> {
    paramsForLogin?: <StrategyKey extends StrategyKeys>(strategy: StrategyKey, ctx: Context) => void | Promise<void> | OptionalRecord<AllowedMapParamsStrategy[StrategyKey], any> | Promise<OptionalRecord<AllowedMapParamsStrategy[StrategyKey], any>>;
}
export declare function createAuthController<StrategyKeys extends AllowedStrategyKeys, U extends User = User, USanitized extends UserSanitized = UserSanitized>({ usersManager, authenticationService, homeRouterKey, defaultStrategy, authHooks, }: CreateAuthControllerParams<StrategyKeys, U, USanitized>): AuthController;
export {};
//# sourceMappingURL=createAuthController.d.ts.map