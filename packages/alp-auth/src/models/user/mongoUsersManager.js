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
    let query = {
      'accounts.provider': provider,
      'accounts.accountId': accountId,
    };

    if (emails && emails.length) {
      query = {
        $or: [
          query,
          {
            emails: { $in: emails },
          },
        ],
      };
    }

    return this.store.findOne(query);
  },

  updateAccount(user: UserType, account: AccountType) {
    let accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, { [`accounts.${accountIndex}`]: account });
  },
});
