import type { MongoInsertType, MongoStore, Update } from 'liwi-mongo';
import type { User, Account, UserSanitized } from './types';

export default class MongoUsersManager<
  U extends User = User,
  USanitized extends UserSanitized = UserSanitized,
> {
  store: MongoStore<U>;

  constructor(store: MongoStore<U>) {
    this.store = store;
  }

  /** @deprecated use findById instead */
  findConnected(connected: string): Promise<U | undefined> {
    return this.store.findByKey(connected);
  }

  findById(userId: string): Promise<U | undefined> {
    return this.store.findByKey(userId);
  }

  insertOne(user: MongoInsertType<U>): Promise<any> {
    return this.store.insertOne(user);
  }

  replaceOne(user: U): Promise<any> {
    return this.store.replaceOne(user);
  }

  sanitize(user: U): USanitized {
    return this.sanitizeBaseUser(user) as USanitized;
  }

  findOneByAccountOrEmails({
    accountId,
    emails,
    provider,
  }: {
    accountId: number | string;
    emails?: string[];
    provider: string;
  }): Promise<U | undefined> {
    let query: any = {
      'accounts.provider': provider,
      'accounts.accountId': accountId,
    };

    if (emails && emails.length > 0) {
      query = {
        $or: [
          query,
          {
            emails: { $in: emails },
          },
        ],
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.store.findOne(query);
  }

  updateAccount(user: U, account: Account): Promise<U> {
    const accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, {
      $set: {
        [`accounts.${accountIndex}`]: account,
      },
    } as Update<U>);
  }

  sanitizeBaseUser(user: U): UserSanitized {
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
}
