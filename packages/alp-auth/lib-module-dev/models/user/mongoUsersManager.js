function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  findOneByAccountOrEmails: function findOneByAccountOrEmails(_arg) {
    var _returnType = t.return(t.nullable(t.ref(UserType)));

    var _t$object$assert = t.object(t.property('provider', t.string()), t.property('accountId', t.union(t.string(), t.number())), t.property('emails', t.nullable(t.array(t.string())))).assert(_arg),
        provider = _t$object$assert.provider,
        accountId = _t$object$assert.accountId,
        emails = _t$object$assert.emails;

    var query = {
      'accounts.provider': provider,
      'accounts.accountId': accountId
    };

    if (emails && emails.length) {
      query = {
        $or: [query, {
          emails: { $in: emails }
        }]
      };
    }

    return this.store.findOne(query).then(function (_arg2) {
      return _returnType.assert(_arg2);
    });
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

    return this.store.partialUpdateOne(user, _defineProperty({}, 'accounts.' + accountIndex, account));
  }
});
//# sourceMappingURL=mongoUsersManager.js.map