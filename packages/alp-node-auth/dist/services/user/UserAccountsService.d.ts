/// <reference types="node" />
import EventEmitter from 'events';
import { AccountId, User, Account } from '../../../types.d';
import MongoUsersManager from '../../MongoUsersManager';
declare type TokensObject = {
    accessToken: string;
    expireDate: Date;
    idToken: string;
    refreshToken?: string;
    tokenType: string;
};
export declare const STATUSES: {
    VALIDATED: string;
    DELETED: string;
};
export default class UserAccountsService extends EventEmitter {
    static strategyToService: {
        [key: string]: any;
    };
    usersManager: MongoUsersManager;
    constructor(usersManager: MongoUsersManager);
    getScope(strategy: string, scopeKey: string, user?: User, accountId?: AccountId): any;
    update(user: User, strategy: string, tokens: TokensObject, scope: string, subservice: string): Promise<User>;
    findOrCreateFromGoogle(strategy: string, tokens: TokensObject, scope: string, subservice: string): Promise<User>;
    updateAccount(user: User, account: Account): Promise<User>;
}
export {};
//# sourceMappingURL=UserAccountsService.d.ts.map