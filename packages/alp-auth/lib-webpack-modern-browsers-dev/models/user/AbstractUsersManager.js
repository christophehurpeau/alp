import _t from 'tcomb-forked';


export default {
  STATUSES: {
    VALIDATED: 'validated',
    DELETED: 'deleted'
  },

  findOneByAccountOrEmails({ provider, accountId, emails }) {
    _assert({
      provider,
      accountId,
      emails
    }, _t.interface({
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
//# sourceMappingURL=abstractUsersManager.js.map