import _t from 'tcomb-forked';


export default {
  STATUSES: {
    VALIDATED: 'validated',
    DELETED: 'deleted'
  },

  findOneByAccountOrEmails(_ref) {
    var provider = _ref.provider,
        accountId = _ref.accountId,
        emails = _ref.emails;

    _assert(arguments[0], _t.interface({
      provider: _t.String,
      accountId: _t.union([_t.String, _t.Number]),
      emails: _t.maybe(_t.list(_t.String))
    }), '{ provider, accountId, emails }');

    return _assert(function () {
      throw new Error('Not implemented');
    }.apply(this, arguments), _t.Promise, 'return value');
  },

  findConnected(connected) {
    return _assert(function () {
      return this.store.findByKey(connected);
    }.apply(this, arguments), _t.Promise, 'return value');
  },

  insertOne(user) {
    return _assert(function () {
      return this.store.insertOne(user);
    }.apply(this, arguments), _t.Promise, 'return value');
  },

  updateOne(user) {
    return _assert(function () {
      return this.store.updateOne(user);
    }.apply(this, arguments), _t.Promise, 'return value');
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
//# sourceMappingURL=abstractUsersManager.js.map