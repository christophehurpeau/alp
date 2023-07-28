/// <reference types="node" />
import { EventEmitter } from 'node:events';
import 'alp-router';
import type { Context, NodeConfig } from 'alp-types';
import type { Strategy as Oauth2Strategy } from '../../../strategies/strategies.d';
import type { AccountId, User, Account, UserSanitized } from '../../types';
import type UserAccountsService from '../user/UserAccountsService';
import type { AllowedStrategyKeys, Tokens } from './types';
export interface GenerateAuthUrlOptions {
    accessType?: string;
    grantType?: string;
    includeGrantedScopes?: boolean;
    loginHint?: string;
    prompt?: string;
    redirectUri?: string;
    scope?: string;
    state?: string;
}
export interface GetTokensOptions {
    code: string;
    redirectUri: string;
}
export type Strategies<StrategyKeys extends AllowedStrategyKeys> = Record<StrategyKeys, Oauth2Strategy<any>>;
export interface AccessResponseHooks<StrategyKeys, U extends User = User> {
    afterLoginSuccess?: <StrategyKey extends StrategyKeys>(strategy: StrategyKey, loggedInUser: U) => Promise<void> | void;
    afterScopeUpdate?: <StrategyKey extends StrategyKeys>(strategy: StrategyKey, scopeKey: string, account: Account, user: U) => Promise<void> | void;
}
export declare class AuthenticationService<StrategyKeys extends AllowedStrategyKeys, U extends User = User, USanitized extends UserSanitized = UserSanitized> extends EventEmitter {
    config: NodeConfig;
    strategies: Strategies<StrategyKeys>;
    userAccountsService: UserAccountsService<StrategyKeys, U, USanitized>;
    constructor(config: NodeConfig, strategies: Strategies<StrategyKeys>, userAccountsService: UserAccountsService<StrategyKeys, U, USanitized>);
    generateAuthUrl<T extends StrategyKeys>(strategy: T, params: any): string;
    getTokens(strategy: StrategyKeys, options: GetTokensOptions): Promise<Tokens>;
    refreshToken(strategy: StrategyKeys, tokensParam: {
        refreshToken: string;
    }): Promise<Tokens>;
    redirectUri(ctx: Context, strategy: string): string;
    redirectAuthUrl(ctx: Context, strategy: StrategyKeys, { refreshToken, scopeKey, user, accountId, }: {
        refreshToken?: string | undefined;
        scopeKey?: string | undefined;
        user?: U;
        accountId?: AccountId;
    }, params?: any): Promise<void>;
    accessResponse<StrategyKey extends StrategyKeys>(ctx: Context, strategy: StrategyKey, isLoggedIn: boolean, hooks: AccessResponseHooks<StrategyKeys, U>): Promise<U>;
    refreshAccountTokens(user: U, account: Account): Promise<boolean>;
}
//# sourceMappingURL=AuthenticationService.d.ts.map