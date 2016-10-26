'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _abstractUsersManager = require('./abstractUsersManager');

var _abstractUsersManager2 = _interopRequireDefault(_abstractUsersManager);

var _index = require('./types/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mongoUsersManager = Object.create(_abstractUsersManager2.default);
exports.default = mongoUsersManager;


Object.assign(mongoUsersManager, {
  findOneByAccountOrEmails(_ref) {
    var _assert2 = _assert(_ref, _tcombForked2.default.interface({
      provider: _tcombForked2.default.String,
      accountId: _tcombForked2.default.union([_tcombForked2.default.String, _tcombForked2.default.Number]),
      emails: _tcombForked2.default.maybe(_tcombForked2.default.list(_tcombForked2.default.String))
    }), '{ provider, accountId, emails }');

    let provider = _assert2.provider,
        accountId = _assert2.accountId,
        emails = _assert2.emails;

    _assert(arguments[0], _tcombForked2.default.interface({
      provider: _tcombForked2.default.String,
      accountId: _tcombForked2.default.union([_tcombForked2.default.String, _tcombForked2.default.Number]),
      emails: _tcombForked2.default.maybe(_tcombForked2.default.list(_tcombForked2.default.String))
    }), '{ provider, accountId, emails }');

    return _assert(function () {
      let query = {
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
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  },

  updateAccount(user, account) {
    _assert(user, _index.UserType, 'user');

    _assert(account, _index.AccountType, 'account');

    let accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, { [`accounts.${ accountIndex }`]: account });
  }
});

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=mongoUsersManager.js.map