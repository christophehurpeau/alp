import abstractUsersManager from './abstractUsersManager';


var mongoUsersManager = Object.create(abstractUsersManager);
export default mongoUsersManager;

Object.assign(mongoUsersManager, {
  findOneByAccountOrEmails({ provider, accountId, emails }) {
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
  },

  updateAccount(user, account) {
    var accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, { [`accounts.${ accountIndex }`]: account });
  }
});
//# sourceMappingURL=mongoUsersManager.js.map