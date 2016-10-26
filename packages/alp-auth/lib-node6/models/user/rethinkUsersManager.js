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
  findOneByAccountOrEmails(_ref) {
    let provider = _ref.provider,
        accountId = _ref.accountId,
        emails = _ref.emails;

    const r = this.store.r;
    let filter = r.row('accounts').contains(row => r.and(row('provider').eq(provider), row('accountId').eq(accountId)));

    if (emails && emails.length) {
      filter = r.or(filter, r.row('emails').contains(row => r.expr(emails).contains(row)));
    }

    let query = this.store.query().filter(filter);
    return this.store.findOne(query);
  },

  updateAccount(user, account) {
    let accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, {
      accounts: this.store.r.row('accounts').changeAt(accountIndex, account)
    });
  }
});
//# sourceMappingURL=rethinkUsersManager.js.map