/// <reference types="node" />
import { EventEmitter } from 'events';
import type { AccountId, User, Account } from '../../../types.d';
import type MongoUsersManager from '../../MongoUsersManager';
import type { AllowedStrategyKeys } from '../authentification/types';
import type { AccountService, TokensObject } from './types';
export declare const STATUSES: {
    VALIDATED: string;
    DELETED: string;
};
export default class UserAccountsService<StrategyKeys extends AllowedStrategyKeys> extends EventEmitter {
    private readonly strategyToService;
    usersManager: MongoUsersManager;
    constructor(usersManager: MongoUsersManager, strategyToService: Record<StrategyKeys, AccountService<any>>);
    getScope(strategy: StrategyKeys, scopeKey: string, user?: User, accountId?: AccountId): string;
    update(user: User, strategy: StrategyKeys, tokens: TokensObject, scope: string, subservice: string): Promise<{
        user: User;
        account: User['accounts'][number];
    }>;
    findOrCreateFromStrategy(strategy: StrategyKeys, tokens: TokensObject, scope: string, subservice: string): Promise<User>;
    updateAccount(user: User, account: Account): Promise<User>;
}
//# sourceMappingURL=UserAccountsService.d.ts.map