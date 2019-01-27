import { InsertType } from 'liwi-types';
import { Store } from 'liwi-store';
import { User, Account, UserSanitized } from '../types.d';
export default class MongoUsersManager {
    store: Store<User, '_id', any, any, any>;
    constructor(store: Store<User, '_id', any, any, any>);
    findConnected(connected: string): Promise<User | undefined>;
    insertOne(user: InsertType<User, '_id'>): Promise<any>;
    replaceOne(user: User): Promise<any>;
    sanitize(user: User): UserSanitized;
    findOneByAccountOrEmails({ accountId, emails, provider, }: {
        accountId: string | number;
        emails?: Array<string>;
        provider: string;
    }): Promise<User | undefined>;
    updateAccount(user: User, account: Account): Promise<User>;
}
//# sourceMappingURL=MongoUsersManager.d.ts.map