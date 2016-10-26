import _t from 'tcomb-forked';
import abstractUsersManager from './abstractUsersManager';
import { UserType, AccountType } from './types/index';

var mongoUsersManager = Object.create(abstractUsersManager);
export default mongoUsersManager;

Object.assign(mongoUsersManager, {
  findOneByAccountOrEmails: function findOneByAccountOrEmails(_ref) {
    var provider = _ref.provider,
        accountId = _ref.accountId,
        emails = _ref.emails;

    _assert(arguments[0], _t.interface({
      provider: _t.String,
      accountId: _t.union([_t.String, _t.Number]),
      emails: _t.maybe(_t.list(_t.String))
    }), '{ provider, accountId, emails }');

    return _assert(function () {
      _assert(arguments[0], _t.interface({
        provider: _t.String,
        accountId: _t.union([_t.String, _t.Number]),
        emails: _t.maybe(_t.list(_t.String))
      }), '{ provider, accountId, emails }');

      return _assert(function () {
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

    return this.store.partialUpdateOne(user, {
      accounts: this.store.r.row('accounts').changeAt(accountIndex, account)
    });
  }
});

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=rethinkUsersManager.js.map