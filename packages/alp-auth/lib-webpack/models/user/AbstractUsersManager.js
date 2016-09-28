

export default {
  STATUSES: {
    VALIDATED: 'validated',
    DELETED: 'deleted'
  },

  findOneByAccountOrEmails: function findOneByAccountOrEmails(_ref) {
    var provider = _ref.provider;
    var accountId = _ref.accountId;
    var emails = _ref.emails;

    throw new Error('Not implemented');
  },
  findConnected: function findConnected(connected) {
    return this.store.findByKey(connected);
  },
  insertOne: function insertOne(user) {
    return this.store.insertOne(user);
  },
  updateOne: function updateOne(user) {
    return this.store.updateOne(user);
  },
  transformForBrowser: function transformForBrowser(user) {
    return {
      displayName: user.displayName,
      fullName: user.fullName,
      status: user.status,
      emails: user.emails,
      accounts: user.accounts.map(function (account) {
        return {
          provider: account.provider,
          accountId: account.accountId,
          name: account.name,
          status: account.status,
          profile: account.profile
        };
      })
    };
  }
};
//# sourceMappingURL=abstractUsersManager.js.map