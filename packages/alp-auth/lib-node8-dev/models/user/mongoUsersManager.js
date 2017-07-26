'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _abstractUsersManager = require('./abstractUsersManager');

var _abstractUsersManager2 = _interopRequireDefault(_abstractUsersManager);

var _index = require('./types/index');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserType = _flowRuntime2.default.tdz(() => _index.UserType);

const AccountType = _flowRuntime2.default.tdz(() => _index.AccountType);

const mongoUsersManager = Object.create(_abstractUsersManager2.default);
exports.default = mongoUsersManager;


Object.assign(mongoUsersManager, {
  findOneByAccountOrEmails(_arg) {
    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.nullable(_flowRuntime2.default.ref(UserType)));

    let {
      provider,
      accountId,
      emails
    } = _flowRuntime2.default.object(_flowRuntime2.default.property('provider', _flowRuntime2.default.string()), _flowRuntime2.default.property('accountId', _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.number())), _flowRuntime2.default.property('emails', _flowRuntime2.default.nullable(_flowRuntime2.default.array(_flowRuntime2.default.string())))).assert(_arg);

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

    return this.store.findOne(query).then(_arg2 => _returnType.assert(_arg2));
  },

  updateAccount(user, account) {
    let _userType = _flowRuntime2.default.ref(UserType);

    let _accountType = _flowRuntime2.default.ref(AccountType);

    _flowRuntime2.default.param('user', _userType).assert(user);

    _flowRuntime2.default.param('account', _accountType).assert(account);

    let accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, { [`accounts.${accountIndex}`]: account });
  }
});
//# sourceMappingURL=mongoUsersManager.js.map