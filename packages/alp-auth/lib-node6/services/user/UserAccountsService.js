'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _userAccountGoogleService = require('./userAccountGoogleService');

var _userAccountGoogleService2 = _interopRequireDefault(_userAccountGoogleService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /* global fetch */


const logger = new _nightingaleLogger2.default('alp-auth.services.userAccounts');

class UserAccountsService extends _events2.default {

  constructor(usersManager) {
    super();
    this.usersManager = usersManager;
  }

  getScope(strategy, scopeKey, user, accountId) {
    logger.debug('getScope', { strategy, userId: user && user._id });
    const service = this.constructor.strategyToService[strategy];
    const newScope = service.constructor.scopeKeyToScope[scopeKey];
    if (!user || !accountId) {
      return newScope;
    }
    const account = user.accounts.find(account => account.provider === strategy && account.accountId === accountId);

    if (!account) {
      throw new Error('Could not found associated account');
    }
    return service.getScope(account.scope, newScope).join(' ');
  }

  update(user, strategy, tokens, scope, subservice) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const service = _this.constructor.strategyToService[strategy];
      const profile = yield service.getProfile(tokens);
      const account = user.accounts.find(function (account) {
        return account.provider === strategy && service.isAccount(account, profile);
      });
      if (!account) {
        // TODO check if already exists in other user => merge
        // TODO else add a new account in this user
        throw new Error('Could not found associated account');
      }
      account.status = 'valid';
      account.accessToken = tokens.accessToken;
      if (tokens.refreshToken) {
        account.refreshToken = tokens.refreshToken;
      }
      if (tokens.expireDate) {
        account.tokenExpireDate = tokens.expireDate;
      }
      account.scope = service.getScope(account.scope, scope);
      account.subservices = account.subservices || [];
      if (subservice && account.subservices.indexOf(subservice) === -1) {
        account.subservices.push(subservice);
      }

      yield _this.usersManager.update(user);
      return user;
    })();
  }

  findOrCreateFromGoogle(strategy, tokens, scope, subservice) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (strategy !== 'google') {
        throw new Error('Not supported at the moment');
      }

      const service = _this2.constructor.strategyToService[strategy];

      const profile = yield service.getProfile(tokens);

      const plusProfile = yield fetch(`https://www.googleapis.com/plus/v1/people/me?access_token=${ tokens.accessToken }`).then(function (response) {
        return response.json();
      });

      const emails = service.getEmails(profile, plusProfile);

      let user = yield _this2.usersManager.findOneByAccountOrEmails({
        provider: service.providerKey,
        accountId: service.getId(profile),
        emails
      });

      console.log(user);

      if (!user) {
        user = {};
      }

      Object.assign(user, {
        displayName: service.getDisplayName(profile),
        fullName: service.getFullName(profile),
        status: _this2.usersManager.STATUSES.VALIDATED
      });

      if (!user.accounts) user.accounts = [];

      const accountId = service.getId(profile);

      let account = user.accounts.find(function (account) {
        return account.provider === strategy && account.accountId === accountId;
      });

      if (!account) {
        account = { provider: strategy, accountId: accountId };
        user.accounts.push(account);
      }

      account.name = service.getAccountName(profile);
      account.status = 'valid';
      account.profile = profile;
      account.accessToken = tokens.accessToken;
      if (tokens.refreshToken) {
        account.refreshToken = tokens.refreshToken;
      }
      if (tokens.expireDate) {
        account.tokenExpireDate = tokens.expireDate;
      }
      account.scope = service.getScope(account.scope, scope);

      if (!account.subservices) account.subservices = [];
      if (subservice && !account.subservices.includes(subservice)) {
        account.subservices.push(subservice);
      }

      if (!user.emails) user.emails = [];
      const userEmails = user.emails;
      emails.forEach(function (email) {
        if (!userEmails.includes(email)) {
          userEmails.push(email);
        }
      });

      const keyPath = _this2.usersManager.store.keyPath;
      yield _this2.usersManager[user[keyPath] ? 'updateOne' : 'insertOne'](user);
      return user;
    })();
  }

  updateAccount(user, account) {
    return this.usersManager.updateAccount(user, account).then(() => user);
  }
}
exports.default = UserAccountsService;
UserAccountsService.strategyToService = {
  google: _userAccountGoogleService2.default
};
//# sourceMappingURL=UserAccountsService.js.map