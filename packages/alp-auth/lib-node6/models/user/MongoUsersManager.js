'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _abstractUsersManager = require('./abstractUsersManager');

var _abstractUsersManager2 = _interopRequireDefault(_abstractUsersManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mongoUsersManager = Object.create(_abstractUsersManager2.default);
exports.default = mongoUsersManager;


Object.assign(mongoUsersManager, {
  findOneByAccountOrEmails({ provider, accountId, emails }) {
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
  },

  updateAccount(user, account) {
    let accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, { [`accounts.${ accountIndex }`]: account });
  }
});
//# sourceMappingURL=mongoUsersManager.js.map