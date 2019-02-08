import { MongoInsertType } from 'liwi-mongo';
import { Store } from 'liwi-store';
import { User, Account, UserSanitized } from '../types.d';
export default class MongoUsersManager<U extends User = User, USanitized extends UserSanitized = UserSanitized> {
    store: Store<U, '_id', any, any, any>;
    constructor(store: Store<U, '_id', any, any, any>);
    findConnected(connected: string): Promise<U | undefined>;
    insertOne(user: MongoInsertType<U>): Promise<any>;
    replaceOne(user: U): Promise<any>;
    sanitize(user: U): USanitized;
    findOneByAccountOrEmails({ accountId, emails, provider, }: {
        accountId: string | number;
        emails?: Array<string>;
        provider: string;
    }): Promise<U | undefined>;
    updateAccount(user: U, account: Account): Promise<U>;
    protected sanitizeBaseUser(user: U): UserSanitized;
}
//# sourceMappingURL=MongoUsersManager.d.ts.map