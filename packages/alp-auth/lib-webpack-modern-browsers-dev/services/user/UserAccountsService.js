import _t from 'tcomb-forked';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/* global fetch */
import EventEmitter from 'events';
import Logger from 'nightingale-logger';
import userAccountGoogleService from './userAccountGoogleService';

var TokensObject = _t.interface({
  accessToken: _t.String,
  refreshToken: _t.maybe(_t.String),
  expireDate: Date,
  tokenType: _t.String,
  idToken: _t.String
}, 'TokensObject');

var logger = new Logger('alp-auth.services.userAccounts');

export default class UserAccountsService extends EventEmitter {

  constructor(usersManager) {
    super();
    this.usersManager = usersManager;
  }

  getScope(strategy, scopeKey, user, accountId) {
    _assert(strategy, _t.String, 'strategy');

    _assert(scopeKey, _t.String, 'scopeKey');

    logger.debug('getScope', { strategy, userId: user && user._id });
    var service = this.constructor.strategyToService[strategy];
    var newScope = service.constructor.scopeKeyToScope[scopeKey];
    if (!user || !accountId) {
      return newScope;
    }
    var account = user.accounts.find(account => account.provider === strategy && account.accountId === accountId);

    if (!account) {
      throw new Error('Could not found associated account');
    }
    return service.getScope(account.scope, newScope).join(' ');
  }

  update(user, strategy, tokens, scope, subservice) {
    var _this = this;

    return _asyncToGenerator(function* () {
      var service = _this.constructor.strategyToService[strategy];
      var profile = yield service.getProfile(tokens);
      var account = user.accounts.find(function (account) {
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
      _assert(strategy, _t.String, 'strategy');

      _assert(tokens, TokensObject, 'tokens');

      _assert(scope, _t.String, 'scope');

      if (strategy !== 'google') {
        throw new Error('Not supported at the moment');
      }

      var service = _this2.constructor.strategyToService[strategy];

      var profile = yield service.getProfile(tokens);

      var plusProfile = yield fetch(`https://www.googleapis.com/plus/v1/people/me?access_token=${ tokens.accessToken }`).then(function (response) {
        return response.json();
      });

      var emails = service.getEmails(profile, plusProfile);

      var user = yield _this2.usersManager.findOneByAccountOrEmails({
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

      var accountId = service.getId(profile);

      var account = user.accounts.find(function (account) {
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
      var userEmails = user.emails;
      emails.forEach(function (email) {
        if (!userEmails.includes(email)) {
          userEmails.push(email);
        }
      });

      var keyPath = _this2.usersManager.store.keyPath;
      yield _this2.usersManager[user[keyPath] ? 'updateOne' : 'insertOne'](user);
      return user;
    })();
  }

  updateAccount(user, account) {
    return this.usersManager.updateAccount(user, account).then(() => user);
  }
}
UserAccountsService.strategyToService = {
  google: userAccountGoogleService
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

    return type(x);
  }

  if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=UserAccountsService.js.map