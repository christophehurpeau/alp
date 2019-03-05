import { MongoInsertType } from 'liwi-mongo';
import { Store, Update } from 'liwi-store';
import { User, Account, UserSanitized } from '../types.d';

export default class MongoUsersManager<
  U extends User = User,
  USanitized extends UserSanitized = UserSanitized
> {
  store: Store<U, '_id', any, any>;

  constructor(store: Store<U, '_id', any, any>) {
    this.store = store;
  }

  findConnected(connected: string): Promise<U | undefined> {
    return this.store.findByKey(connected);
  }

  insertOne(user: MongoInsertType<U>): Promise<any> {
    return this.store.insertOne(user);
  }

  replaceOne(user: U): Promise<any> {
    return this.store.replaceOne(user);
  }

  public sanitize(user: U): USanitized {
    return this.sanitizeBaseUser(user) as USanitized;
  }

  findOneByAccountOrEmails({
    accountId,
    emails,
    provider,
  }: {
    accountId: string | number;
    emails?: string[];
    provider: string;
  }): Promise<U | undefined> {
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

  updateAccount(user: U, account: Account) {
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

  protected sanitizeBaseUser(user: U): UserSanitized {
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
