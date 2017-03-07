import { UserType as _UserType } from './types';

import t from 'flow-runtime';
const UserType = t.tdz(() => _UserType);
export default {
  STATUSES: {
    VALIDATED: 'validated',
    DELETED: 'deleted'
  },

  findOneByAccountOrEmails({ provider, accountId, emails }) {
    t.return(t.ref('Promise', t.nullable(t.ref(UserType))));
    t.param('arguments[0]', t.object(t.property('provider', t.string()), t.property('accountId', t.union(t.string(), t.number())), t.property('emails', t.nullable(t.array(t.string()))))).assert(arguments[0]);

    throw new Error('Not implemented');
  },

  findConnected(connected) {
    const _returnType2 = t.return(t.ref('Promise', t.nullable(t.ref(UserType))));

    return _returnType2.assert(this.store.findByKey(connected));
  },

  insertOne(user) {
    const _returnType3 = t.return(t.ref('Promise', t.any()));

    return _returnType3.assert(this.store.insertOne(user));
  },

  updateOne(user) {
    const _returnType4 = t.return(t.ref('Promise', t.any()));

    return _returnType4.assert(this.store.updateOne(user));
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
        profile: account.profile
      }))
    };
  }
};
//# sourceMappingURL=abstractUsersManager.js.map