import { InsertType } from 'liwi-types';
import { Store } from 'liwi-store';
import { User, Account, UserSanitized } from '../types.d';

export default class MongoUsersManager {
  static STATUSES = {
    VALIDATED: 'validated',
    DELETED: 'deleted',
  };

  store: Store<User, '_id', any, any, any>;

  constructor(store: Store<User, '_id', any, any, any>) {
    this.store = store;
  }

  findConnected(connected: string): Promise<User | undefined> {
    return this.store.findByKey(connected);
  }

  insertOne(user: InsertType<User, '_id'>): Promise<any> {
    return this.store.insertOne(user);
  }

  replaceOne(user: User): Promise<any> {
    return this.store.replaceOne(user);
  }

  sanitize(user: User): UserSanitized {
    return {
      _id: user._id,
      created: user.created,
      updated: user.updated,
      displayName: user.displayName,
      fullName: user.fullName,
      status: user.status,
      emails: user.emails,
      emailDomains: user.emailDomains,
      accounts: user.accounts.map((account: Account) => ({
        provider: account.provider,
        accountId: account.accountId,
        name: account.name,
        status: account.status,
        profile: account.profile,
      })),
    };
  }

  findOneByAccountOrEmails({
    accountId,
    emails,
    provider,
  }: {
    accountId: string | number;
    emails?: Array<string>;
    provider: string;
  }): Promise<User | undefined> {
    let query: any = {
      'accounts.provider': provider,
      'accounts.accountId': accountId,
    };

    if (emails && emails.length !== 0) {
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
  }

  updateAccount(user: User, account: Account) {
    const accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, {
      $set: {
        [`accounts.${accountIndex}`]: account,
      },
    });
  }
}
