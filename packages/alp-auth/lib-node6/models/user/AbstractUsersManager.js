'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  STATUSES: {
    VALIDATED: 'validated',
    DELETED: 'deleted'
  },

  findOneByAccountOrEmails(_ref) {
    let provider = _ref.provider;
    let accountId = _ref.accountId;
    let emails = _ref.emails;

    throw new Error('Not implemented');
  },

  findConnected(connected) {
    return this.store.findByKey(connected);
  },

  insertOne(user) {
    return this.store.insertOne(user);
  },

  updateOne(user) {
    return this.store.updateOne(user);
  },

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
};
//# sourceMappingURL=abstractUsersManager.js.map