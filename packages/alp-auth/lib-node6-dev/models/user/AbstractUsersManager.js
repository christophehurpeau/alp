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

  findOneByAccountOrEmails(_ref) {
    var _assert2 = _assert(_ref, _tcombForked2.default.interface({
      provider: _tcombForked2.default.String,
      accountId: _tcombForked2.default.union([_tcombForked2.default.String, _tcombForked2.default.Number]),
      emails: _tcombForked2.default.maybe(_tcombForked2.default.list(_tcombForked2.default.String))
    }), '{ provider, accountId, emails }');

    let provider = _assert2.provider;
    let accountId = _assert2.accountId;
    let emails = _assert2.emails;

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
      displayName: user.displayName,
      fullName: user.fullName,
      status: user.status,
      emails: user.emails,
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
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }

    return type(x);
  }

  if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=abstractUsersManager.js.map