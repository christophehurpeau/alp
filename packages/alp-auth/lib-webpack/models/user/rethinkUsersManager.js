import abstractUsersManager from './abstractUsersManager';


var mongoUsersManager = Object.create(abstractUsersManager);
export default mongoUsersManager;

Object.assign(mongoUsersManager, {
  findOneByAccountOrEmails: function findOneByAccountOrEmails(_ref) {
    var provider = _ref.provider;
    var accountId = _ref.accountId;
    var emails = _ref.emails;

    var r = this.store.r;
    var filter = r.row('accounts').contains(function (row) {
      return r.and(row('provider').eq(provider), row('accountId').eq(accountId));
    });

    if (emails && emails.length) {
      filter = r.or(filter, r.row('emails').contains(function (row) {
        return r.expr(emails).contains(row);
      }));
    }

    var query = this.store.query().filter(filter);
    return this.store.findOne(query);
  },
  updateAccount: function updateAccount(user, account) {
    var accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, {
      accounts: this.store.r.row('accounts').changeAt(accountIndex, account)
    });
  }
});
//# sourceMappingURL=rethinkUsersManager.js.map