import abstractUsersManager from './abstractUsersManager';
import type { UserType, AccountType } from './types/index';

const mongoUsersManager = Object.create(abstractUsersManager);
export default mongoUsersManager;

Object.assign(mongoUsersManager, {
  findOneByAccountOrEmails({
    provider,
    accountId,
    emails,
  }: {
    provider: string,
    accountId: string | number,
    emails: ?Array<string>,
  }): Promise<?UserType> {
    const r = this.store.r;
    let filter = r
      .row('accounts')
      .contains(row => r.and(row('provider').eq(provider), row('accountId').eq(accountId)));

    if (emails && emails.length) {
      filter = r.or(filter, r.row('emails').contains(row => r.expr(emails).contains(row)));
    }

    let query = this.store.query().filter(filter);
    return this.store.findOne(query);
  },

  updateAccount(user: UserType, account: AccountType) {
    let accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, {
      accounts: this.store.r.row('accounts').changeAt(accountIndex, account),
    });
  },
});
