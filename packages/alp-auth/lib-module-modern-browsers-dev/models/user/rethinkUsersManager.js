import abstractUsersManager from './abstractUsersManager';
import { UserType as _UserType, AccountType as _AccountType } from './types/index';

import t from 'flow-runtime';
const UserType = t.tdz(function () {
  return _UserType;
});
const AccountType = t.tdz(function () {
  return _AccountType;
});
const mongoUsersManager = Object.create(abstractUsersManager);
export default mongoUsersManager;

Object.assign(mongoUsersManager, {
  findOneByAccountOrEmails({ provider, accountId, emails }) {
    const _returnType = t.return(t.ref('Promise', t.nullable(t.ref(UserType))));

    t.param('arguments[0]', t.object(t.property('provider', t.string()), t.property('accountId', t.union(t.string(), t.number())), t.property('emails', t.nullable(t.array(t.string()))))).assert(arguments[0]);

    const r = this.store.r;
    let filter = r.row('accounts').contains(function (row) {
      return r.and(row('provider').eq(provider), row('accountId').eq(accountId));
    });

    if (emails && emails.length) {
      filter = r.or(filter, r.row('emails').contains(function (row) {
        return r.expr(emails).contains(row);
      }));
    }

    let query = this.store.query().filter(filter);
    return _returnType.assert(this.store.findOne(query));
  },

  updateAccount(user, account) {
    let _userType = t.ref(UserType);

    let _accountType = t.ref(AccountType);

    t.param('user', _userType).assert(user);
    t.param('account', _accountType).assert(account);

    let accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, {
      accounts: this.store.r.row('accounts').changeAt(accountIndex, account)
    });
  }
});
//# sourceMappingURL=rethinkUsersManager.js.map