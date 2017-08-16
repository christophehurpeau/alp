import abstractUsersManager from './abstractUsersManager';


const mongoUsersManager = Object.create(abstractUsersManager);
export default mongoUsersManager;

Object.assign(mongoUsersManager, {
  findOneByAccountOrEmails({
    provider,
    accountId,
    emails
  }) {
    let query = {
      'accounts.provider': provider,
      'accounts.accountId': accountId
    };

    return emails && emails.length && (query = {
      $or: [query, {
        emails: { $in: emails }
      }]
    }), this.store.findOne(query);
  },

  updateAccount(user, account) {
    let accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) throw new Error('Invalid account');

    return this.store.partialUpdateOne(user, { [`accounts.${accountIndex}`]: account });
  }
});
//# sourceMappingURL=mongoUsersManager.js.map