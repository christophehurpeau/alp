import { UserType as _UserType } from './types';

import t from 'flow-runtime';
var UserType = t.tdz(function () {
  return _UserType;
});
export default {
  STATUSES: {
    VALIDATED: 'validated',
    DELETED: 'deleted'
  },

  findOneByAccountOrEmails: function findOneByAccountOrEmails(_arg) {
    t.return(t.nullable(t.ref(UserType)));

    var _t$object$assert = t.object(t.property('provider', t.string()), t.property('accountId', t.union(t.string(), t.number())), t.property('emails', t.nullable(t.array(t.string())))).assert(_arg),
        provider = _t$object$assert.provider,
        accountId = _t$object$assert.accountId,
        emails = _t$object$assert.emails;

    throw new Error('Not implemented');
  },
  findConnected: function findConnected(connected) {
    var _returnType2 = t.return(t.nullable(t.ref(UserType)));

    return this.store.findByKey(connected).then(function (_arg2) {
      return _returnType2.assert(_arg2);
    });
  },
  insertOne: function insertOne(user) {
    var _returnType3 = t.return(t.any());

    return this.store.insertOne(user).then(function (_arg3) {
      return _returnType3.assert(_arg3);
    });
  },
  updateOne: function updateOne(user) {
    var _returnType4 = t.return(t.any());

    return this.store.updateOne(user).then(function (_arg4) {
      return _returnType4.assert(_arg4);
    });
  },
  transformForBrowser: function transformForBrowser(user) {
    return {
      id: user.id,
      displayName: user.displayName,
      fullName: user.fullName,
      status: user.status,
      emails: user.emails,
      emailDomains: user.emailDomains,
      accounts: user.accounts.map(function (account) {
        return {
          provider: account.provider,
          accountId: account.accountId,
          name: account.name,
          status: account.status,
          profile: account.profile
        };
      })
    };
  }
};
//# sourceMappingURL=abstractUsersManager.js.map