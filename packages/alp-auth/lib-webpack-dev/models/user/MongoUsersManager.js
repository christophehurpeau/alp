import _t from 'tcomb-forked';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import abstractUsersManager from './abstractUsersManager';
import { UserType, AccountType } from './types/index';

var mongoUsersManager = Object.create(abstractUsersManager);
export default mongoUsersManager;

Object.assign(mongoUsersManager, {
  findOneByAccountOrEmails: function findOneByAccountOrEmails(_ref) {
    var provider = _ref.provider,
        accountId = _ref.accountId,
        emails = _ref.emails;

    _assert({
      provider: provider,
      accountId: accountId,
      emails: emails
    }, _t.interface({
      provider: _t.String,
      accountId: _t.union([_t.String, _t.Number]),
      emails: _t.maybe(_t.list(_t.String))
    }), '{ provider, accountId, emails }');

    return _assert(function () {
      _assert({
        provider: provider,
        accountId: accountId,
        emails: emails
      }, _t.interface({
        provider: _t.String,
        accountId: _t.union([_t.String, _t.Number]),
        emails: _t.maybe(_t.list(_t.String))
      }), '{ provider, accountId, emails }');

      return _assert(function () {
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

        return this.store.findOne(query);
      }.apply(this, arguments), _t.Promise, 'return value');
    }.apply(this, arguments), _t.Promise, 'return value');
  },
  updateAccount: function updateAccount(user, account) {
    _assert(user, UserType, 'user');

    _assert(account, AccountType, 'account');

    _assert(user, UserType, 'user');

    _assert(account, AccountType, 'account');

    var accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, _defineProperty({}, 'accounts.' + accountIndex, account));
  }
});

function _assert(x, type, name) {
  if (false) {
    _t.fail = function (message) {
      console.warn(message);
    };
  }

  if (_t.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _t.fail('Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=mongoUsersManager.js.map