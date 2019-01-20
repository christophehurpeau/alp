/// <reference types="node" />
import EventEmitter from 'events';
import { OAuthClient } from 'simple-oauth2';
import { NodeConfig } from 'alp-types';
import UserAccountsService from '../user/UserAccountsService';
import { AccountId, User, Account } from '../../../types.d';
import { Tokens } from './types';
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
    code?: string;
    redirectUri?: string;
}
export interface Strategy {
    type: string;
    [key: string]: any;
}
export interface Oauth2Strategy extends Strategy {
    oauth2: OAuthClient;
}
export declare type Strategies = {
    [strategy: string]: Strategy;
};
export default class AuthenticationService extends EventEmitter {
    config: NodeConfig;
    strategies: Strategies;
    userAccountsService: UserAccountsService;
    constructor(config: NodeConfig, strategies: Strategies, userAccountsService: UserAccountsService);
    /**
     * @param {string} strategy
     * @param {Object} options
     * @param {string} [options.redirectUri]
     * @param {string} [options.scope]
     * Space-delimited set of permissions that the application requests.
     * @param {string} [options.state]
     * Any string that might be useful to your application upon receipt of the response
     * @param {string} [options.grantType]
     * @param {string} [options.accessType = 'online']
     * online or offline
     * @param {string} [options.prompt]
     * Space-delimited, case-sensitive list of prompts to present the user.
     * Values: none, consent, select_account
     * @param {string} [options.loginHint] email address or sub identifier
     * @param {boolean} [options.includeGrantedScopes]
     * If this is provided with the value true, and the authorization request is granted,
     * the authorization will include any previous authorizations granted
     * to this user/application combination for other scopes
     * @returns {string}
     */
    generateAuthUrl(strategy: string, options?: GenerateAuthUrlOptions): any;
    getTokens(strategy: string, options?: GetTokensOptions): Promise<Tokens>;
    refreshToken(strategy: string, tokensParam: {
        refreshToken: string;
    }): Promise<{
        accessToken: any;
        tokenType: any;
        expiresIn: any;
        expireDate: Date;
        idToken: any;
    }>;
    redirectUri(ctx: any, strategy: string): string;
    /**
     *
     * @param {Koa.Context} ctx
     * @param {string} strategy
     * @param {string} [refreshToken]
     * @param {string} [scopeKey='login']
     * @param user
     * @param accountId
     * @returns {*}
     */
    redirectAuthUrl(ctx: any, strategy: string, refreshToken?: string | undefined, scopeKey?: string | undefined, user?: User, accountId?: AccountId): Promise<any>;
    /**
     * @param {Koa.Context} ctx
     * @param {string} strategy
     * @param {boolean} isConnected
     * @returns {*}
     */
    accessResponse(ctx: any, strategy: string, isConnected?: boolean): Promise<any>;
    refreshAccountTokens(user: User, account: Account): Promise<boolean>;
}
//# sourceMappingURL=AuthenticationService.d.ts.map