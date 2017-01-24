'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  STATUSES: {
    VALIDATED: 'validated',
    DELETED: 'deleted'
  },

  findOneByAccountOrEmails({ provider, accountId, emails }) {
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
      id: user.id,
      displayName: user.displayName,
      fullName: user.fullName,
      status: user.status,
      emails: user.emails,
      emailDomains: user.emailDomains,
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