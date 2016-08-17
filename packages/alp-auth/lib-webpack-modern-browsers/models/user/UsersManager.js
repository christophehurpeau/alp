
import { AbstractManager } from 'liwi';


export default class UsersManager extends AbstractManager {
    constructor() {
        var _temp;

        return _temp = super(...arguments), this.STATUSES = UsersManager.STATUSES, _temp;
    }

    findOneByAccountOrEmails(_ref) {
        var provider = _ref.provider;
        var accountId = _ref.accountId;
        var emails = _ref.emails;

        var query = {
            'accounts.provider': provider,
            'accounts.accountId': accountId
        };

        if (emails && emails.length) {
            query = {
                $or: [query, {
                    emails: { $in: emails }
                }]
            };
        }

        return this.store.findOne(query);
    }

    findConnected(connected) {
        return this.store.findByKey(connected);
    }

    insertOne(user) {
        return this.store.insertOne(user);
    }

    updateOne(user) {
        return this.store.updateOne(user);
    }

    updateAccount(user, account) {
        var accountIndex = user.accounts.indexOf(account);
        return this.store.partialUpdateOne(user, { [`accounts.${ accountIndex }`]: account });
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
                profile: account.profile
            }))
        };
    }
}
UsersManager.STATUSES = {
    VALIDATED: 'validated',
    DELETED: 'deleted'
};
//# sourceMappingURL=UsersManager.js.map