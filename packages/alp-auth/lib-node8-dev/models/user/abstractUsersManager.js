'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require('./types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserType = _flowRuntime2.default.tdz(() => _types.UserType);

exports.default = {
  STATUSES: {
    VALIDATED: 'validated',
    DELETED: 'deleted'
  },

  findOneByAccountOrEmails(_arg) {
    _flowRuntime2.default.return(_flowRuntime2.default.nullable(_flowRuntime2.default.ref(UserType)));

    let {
      provider,
      accountId,
      emails
    } = _flowRuntime2.default.object(_flowRuntime2.default.property('provider', _flowRuntime2.default.string()), _flowRuntime2.default.property('accountId', _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.number())), _flowRuntime2.default.property('emails', _flowRuntime2.default.nullable(_flowRuntime2.default.array(_flowRuntime2.default.string())))).assert(_arg);

    throw new Error('Not implemented');
  },

  findConnected(connected) {
    const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.nullable(_flowRuntime2.default.ref(UserType)));

    return this.store.findByKey(connected).then(_arg2 => _returnType2.assert(_arg2));
  },

  insertOne(user) {
    const _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.any());

    return this.store.insertOne(user).then(_arg3 => _returnType3.assert(_arg3));
  },

  updateOne(user) {
    const _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.any());

    return this.store.updateOne(user).then(_arg4 => _returnType4.assert(_arg4));
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
//# sourceMappingURL=abstractUsersManager.js.map