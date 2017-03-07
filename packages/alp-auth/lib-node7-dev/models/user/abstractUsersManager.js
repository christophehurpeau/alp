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

  findOneByAccountOrEmails({ provider, accountId, emails }) {
    _flowRuntime2.default.return(_flowRuntime2.default.ref('Promise', _flowRuntime2.default.nullable(_flowRuntime2.default.ref(UserType))));

    _flowRuntime2.default.param('arguments[0]', _flowRuntime2.default.object(_flowRuntime2.default.property('provider', _flowRuntime2.default.string()), _flowRuntime2.default.property('accountId', _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.number())), _flowRuntime2.default.property('emails', _flowRuntime2.default.nullable(_flowRuntime2.default.array(_flowRuntime2.default.string()))))).assert(arguments[0]);

    throw new Error('Not implemented');
  },

  findConnected(connected) {
    const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref('Promise', _flowRuntime2.default.nullable(_flowRuntime2.default.ref(UserType))));

    return _returnType2.assert(this.store.findByKey(connected));
  },

  insertOne(user) {
    const _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.ref('Promise', _flowRuntime2.default.any()));

    return _returnType3.assert(this.store.insertOne(user));
  },

  updateOne(user) {
    const _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.ref('Promise', _flowRuntime2.default.any()));

    return _returnType4.assert(this.store.updateOne(user));
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