'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongo = require('liwi/mongo');

var _mongo2 = _interopRequireDefault(_mongo);

var _liwi = require('liwi');

var _types = require('./types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UsersManager extends _liwi.AbstractManager {
    constructor() {
        var _temp;

        return _temp = super(...arguments), this.STATUSES = UsersManager.STATUSES, _temp;
    }

    findOneByAccountOrEmails(_ref) {
        let provider = _ref.provider;
        let accountId = _ref.accountId;
        let emails = _ref.emails;

        let query = {
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
        let accountIndex = user.accounts.indexOf(account);
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
                status: account.status
            }))
        };
    }
}
exports.default = UsersManager;
UsersManager.STATUSES = {
    VALIDATED: 'validated',
    DELETED: 'deleted'
};
//# sourceMappingURL=UsersManager.js.map