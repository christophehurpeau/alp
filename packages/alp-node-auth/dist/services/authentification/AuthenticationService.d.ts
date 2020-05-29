/// <reference types="node" />
import { EventEmitter } from 'events';
import { OAuthClient } from 'simple-oauth2';
import { NodeConfig } from 'alp-types';
import UserAccountsService from '../user/UserAccountsService';
import { AccountId, User, Account } from '../../../types.d';
import { AllowedStrategyKeys, Tokens } from './types';
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
export interface Strategy {
    type: string;
}
export interface Oauth2Strategy<Params extends string> extends Strategy {
    oauth2: OAuthClient<Params>;
}
export declare type Strategies<StrategyKeys extends AllowedStrategyKeys> = Record<StrategyKeys, Oauth2Strategy<any>>;
export interface AccessResponseHooks<StrategyKeys> {
    afterLoginSuccess?: <StrategyKey extends StrategyKeys>(strategy: StrategyKey, connectedUser: any) => void | Promise<void>;
    afterScopeUpdate?: <StrategyKey extends StrategyKeys>(strategy: StrategyKey, scopeKey: string, account: Account, user: User) => void | Promise<void>;
}
export default class AuthenticationService<StrategyKeys extends AllowedStrategyKeys> extends EventEmitter {
    config: NodeConfig;
    strategies: Strategies<StrategyKeys>;
    userAccountsService: UserAccountsService<StrategyKeys>;
    constructor(config: NodeConfig, strategies: Strategies<StrategyKeys>, userAccountsService: UserAccountsService<StrategyKeys>);
    generateAuthUrl<T extends StrategyKeys>(strategy: T, params: any): string;
    getTokens(strategy: StrategyKeys, options: GetTokensOptions): Promise<Tokens>;
    refreshToken(strategy: StrategyKeys, tokensParam: {
        refreshToken: string;
    }): Promise<{
        accessToken: any;
        tokenType: any;
        expiresIn: any;
        expireDate: Date;
        idToken: any;
    }>;
    redirectUri(ctx: any, strategy: string): string;
    redirectAuthUrl(ctx: any, strategy: StrategyKeys, { refreshToken, scopeKey, user, accountId, }: {
        refreshToken?: string | undefined;
        scopeKey?: string | undefined;
        user?: User;
        accountId?: AccountId;
    }, params?: any): Promise<any>;
    accessResponse<StrategyKey extends StrategyKeys>(ctx: any, strategy: StrategyKey, isConnected: undefined | boolean, hooks: AccessResponseHooks<StrategyKeys>): Promise<any>;
    refreshAccountTokens(user: User, account: Account): Promise<boolean>;
}
//# sourceMappingURL=AuthenticationService.d.ts.map