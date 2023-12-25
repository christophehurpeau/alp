import type { AlpRouteRef } from 'alp-router';
import type { Context } from 'alp-types';
import type MongoUsersManager from './MongoUsersManager';
import type { AuthenticationService, AccessResponseHooks } from './services/authentification/AuthenticationService';
import type { AllowedStrategyKeys, AllowedMapParamsStrategy } from './services/authentification/types';
import type { User, UserSanitized } from './types';
export interface CreateAuthControllerParams<StrategyKeys extends AllowedStrategyKeys, U extends User = User, USanitized extends UserSanitized = UserSanitized> {
    authenticationService: AuthenticationService<StrategyKeys, U, UserSanitized>;
    homeRouterKey?: string;
    usersManager: MongoUsersManager<U, USanitized>;
    defaultStrategy?: StrategyKeys;
    authHooks?: AuthHooks<StrategyKeys>;
}
export interface AuthController {
    login: AlpRouteRef;
    addScope: AlpRouteRef;
    response: AlpRouteRef;
    logout: AlpRouteRef;
}
type OptionalRecord<K extends keyof any, T> = {
    [P in K]?: T;
};
export interface AuthHooks<StrategyKeys extends AllowedStrategyKeys> extends AccessResponseHooks<StrategyKeys> {
    paramsForLogin?: <StrategyKey extends StrategyKeys>(strategy: StrategyKey, ctx: Context) => OptionalRecord<AllowedMapParamsStrategy[StrategyKey], any> | Promise<OptionalRecord<AllowedMapParamsStrategy[StrategyKey], any>> | Promise<void> | void;
}
export declare function createAuthController<StrategyKeys extends AllowedStrategyKeys, U extends User = User, USanitized extends UserSanitized = UserSanitized>({ usersManager, authenticationService, homeRouterKey, defaultStrategy, authHooks, }: CreateAuthControllerParams<StrategyKeys, U, USanitized>): AuthController;
export {};
//# sourceMappingURL=createAuthController.d.ts.map