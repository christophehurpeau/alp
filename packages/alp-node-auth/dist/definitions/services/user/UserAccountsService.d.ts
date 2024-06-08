/// <reference types="node" />
import { EventEmitter } from "node:events";
import type MongoUsersManager from "../../MongoUsersManager";
import type { AccountId, User, Account, UserSanitized } from "../../types";
import type { AllowedStrategyKeys } from "../authentification/types";
import type { AccountService, TokensObject } from "./types";
export declare const STATUSES: {
    VALIDATED: string;
    DELETED: string;
};
export default class UserAccountsService<StrategyKeys extends AllowedStrategyKeys, U extends User = User, USanitized extends UserSanitized = UserSanitized> extends EventEmitter {
    private readonly strategyToService;
    usersManager: MongoUsersManager<U, USanitized>;
    constructor(usersManager: MongoUsersManager<U, USanitized>, strategyToService: Record<StrategyKeys, AccountService<any>>);
    getScope(strategy: StrategyKeys, scopeKey: string, user?: U, accountId?: AccountId): string;
    update(user: U, strategy: StrategyKeys, tokens: TokensObject, scope: string, subservice: string): Promise<{
        user: U;
        account: U["accounts"][number];
    }>;
    findOrCreateFromStrategy(strategy: StrategyKeys, tokens: TokensObject, scope: string, subservice: string): Promise<U>;
    updateAccount(user: U, account: Account): Promise<U>;
}
//# sourceMappingURL=UserAccountsService.d.ts.map