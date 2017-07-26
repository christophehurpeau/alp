import type { UserType } from './types';

export default {
  STATUSES: {
    VALIDATED: 'validated',
    DELETED: 'deleted',
  },

  findOneByAccountOrEmails({
    provider,
    accountId,
    emails,
  }: {
    provider: string,
    accountId: string | number,
    emails: ?Array<string>,
  }): Promise<?UserType> {
    throw new Error('Not implemented');
  },

  findConnected(connected): Promise<?UserType> {
    return this.store.findByKey(connected);
  },

  insertOne(user): Promise<any> {
    return this.store.insertOne(user);
  },

  updateOne(user): Promise<any> {
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
        profile: account.profile,
      })),
    };
  },
};
