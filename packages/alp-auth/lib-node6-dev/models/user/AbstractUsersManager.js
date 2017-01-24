'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  STATUSES: {
    VALIDATED: 'validated',
    DELETED: 'deleted'
  },

  findOneByAccountOrEmails({ provider, accountId, emails }) {
    _assert({
      provider,
      accountId,
      emails
    }, _tcombForked2.default.interface({
      provider: _tcombForked2.default.String,
      accountId: _tcombForked2.default.union([_tcombForked2.default.String, _tcombForked2.default.Number]),
      emails: _tcombForked2.default.maybe(_tcombForked2.default.list(_tcombForked2.default.String))
    }), '{ provider, accountId, emails }');

    return _assert(function () {
      throw new Error('Not implemented');
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  },

  findConnected(connected) {
    return _assert(function () {
      return this.store.findByKey(connected);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  },

  insertOne(user) {
    return _assert(function () {
      return this.store.insertOne(user);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  },

  updateOne(user) {
    return _assert(function () {
      return this.store.updateOne(user);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
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
  if (false) {
    _tcombForked2.default.fail = function (message) {
      console.warn(message);
    };
  }

  if (_tcombForked2.default.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail('Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=abstractUsersManager.js.map