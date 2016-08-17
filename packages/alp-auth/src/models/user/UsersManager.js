import MongoStore from 'liwi/mongo';
import { AbstractManager } from 'liwi';
import { UserType, AccountType } from './types';

export default class UsersManager extends AbstractManager {
    store: MongoStore;

    static STATUSES = {
        VALIDATED: 'validated',
        DELETED: 'deleted',
    };

    STATUSES = UsersManager.STATUSES;

    findOneByAccountOrEmails(
        { provider, accountId, emails }:
            { provider: string; accountId: string|number; emails: ?Array<string> }
    ): Promise<?UserType> {
        let query = {
            'accounts.provider': provider,
            'accounts.accountId': accountId,
        };

        if (emails && emails.length) {
            query = {
                $or: [
                    query,
                    {
                        emails: { $in: emails },
                    },
                ],
            };
        }

        return this.store.findOne(query);
    }

    findConnected(connected): Promise<?UserType> {
        return this.store.findByKey(connected);
    }

    insertOne(user): Promise {
        return this.store.insertOne(user);
    }

    updateOne(user): Promise {
        return this.store.updateOne(user);
    }

    updateAccount(user: UserType, account: AccountType) {
        let accountIndex = user.accounts.indexOf(account);
        return this.store.partialUpdateOne(user, { [`accounts.${accountIndex}`]: account });
    }

    transformForBrowser(user) {
        return {
            displayName: user.displayName,
            fullName: user.fullName,
            status: user.status,
            emails: user.emails,
            accounts: user.accounts.map(account => ({
                provider: account.provider,
                accountId: account.accountId,
                name: account.name,
                status: account.status,
                profile: account.profile,
            })),
        };
    }
}
