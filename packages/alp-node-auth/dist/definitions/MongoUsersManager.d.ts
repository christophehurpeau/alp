import type { MongoInsertType, MongoStore } from "liwi-mongo";
import type { Account, User, UserSanitized } from "./types";
export default class MongoUsersManager<U extends User = User, USanitized extends UserSanitized = UserSanitized> {
    store: MongoStore<U>;
    constructor(store: MongoStore<U>);
    /** @deprecated use findById instead */
    findConnected(connected: string): Promise<U | undefined>;
    findById(userId: string): Promise<U | undefined>;
    insertOne(user: MongoInsertType<U>): Promise<any>;
    replaceOne(user: U): Promise<any>;
    sanitize(user: U): USanitized;
    findOneByAccountOrEmails({ accountId, emails, provider, }: {
        accountId: number | string;
        emails?: string[];
        provider: string;
    }): Promise<U | undefined>;
    updateAccount(user: U, account: Account): Promise<U>;
    sanitizeBaseUser(user: U): UserSanitized;
}
//# sourceMappingURL=MongoUsersManager.d.ts.map