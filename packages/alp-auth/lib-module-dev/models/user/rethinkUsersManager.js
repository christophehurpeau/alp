import abstractUsersManager from './abstractUsersManager';
import { UserType as _UserType, AccountType as _AccountType } from './types/index';

import t from 'flow-runtime';
var UserType = t.tdz(function () {
  return _UserType;
});
var AccountType = t.tdz(function () {
  return _AccountType;
});
var mongoUsersManager = Object.create(abstractUsersManager);
export default mongoUsersManager;

Object.assign(mongoUsersManager, {
  findOneByAccountOrEmails: function findOneByAccountOrEmails(_ref) {
    var provider = _ref.provider,
        accountId = _ref.accountId,
        emails = _ref.emails;

    var _returnType = t.return(t.ref('Promise', t.nullable(t.ref(UserType))));

    t.param('arguments[0]', t.object(t.property('provider', t.string()), t.property('accountId', t.union(t.string(), t.number())), t.property('emails', t.nullable(t.array(t.string()))))).assert(arguments[0]);

    var r = this.store.r;
    var filter = r.row('accounts').contains(function (row) {
      return r.and(row('provider').eq(provider), row('accountId').eq(accountId));
    });

    if (emails && emails.length) {
      filter = r.or(filter, r.row('emails').contains(function (row) {
        return r.expr(emails).contains(row);
      }));
    }

    var query = this.store.query().filter(filter);
    return _returnType.assert(this.store.findOne(query));
  },
  updateAccount: function updateAccount(user, account) {
    var _userType = t.ref(UserType);

    var _accountType = t.ref(AccountType);

    t.param('user', _userType).assert(user);
    t.param('account', _accountType).assert(account);

    var accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, {
      accounts: this.store.r.row('accounts').changeAt(accountIndex, account)
    });
  }
});
//# sourceMappingURL=rethinkUsersManager.js.map