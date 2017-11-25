'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class, _temp; /* global fetch */


var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _userAccountGoogleService = require('./userAccountGoogleService');

var _userAccountGoogleService2 = _interopRequireDefault(_userAccountGoogleService);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TokensObject = _flowRuntime2.default.type('TokensObject', _flowRuntime2.default.object(_flowRuntime2.default.property('accessToken', _flowRuntime2.default.string()), _flowRuntime2.default.property('refreshToken', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('expireDate', _flowRuntime2.default.ref('Date')), _flowRuntime2.default.property('tokenType', _flowRuntime2.default.string()), _flowRuntime2.default.property('idToken', _flowRuntime2.default.string())));

const logger = new _nightingaleLogger2.default('alp:auth:userAccounts');

let UserAccountsService = (_temp = _class = class extends _events2.default {

  constructor(usersManager) {
    super();
    this.usersManager = usersManager;
  }

  getScope(strategy, scopeKey, user, accountId) {
    let _strategyType = _flowRuntime2.default.string();

    let _scopeKeyType = _flowRuntime2.default.string();

    _flowRuntime2.default.param('strategy', _strategyType).assert(strategy);

    _flowRuntime2.default.param('scopeKey', _scopeKeyType).assert(scopeKey);

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

  async update(user, strategy, tokens, scope, subservice) {
    const service = this.constructor.strategyToService[strategy];
    const profile = await service.getProfile(tokens);
    const account = user.accounts.find(account => account.provider === strategy && service.isAccount(account, profile));
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

    await this.usersManager.update(user);
    return user;
  }

  async findOrCreateFromGoogle(strategy, tokens, scope, subservice) {
    let _strategyType2 = _flowRuntime2.default.string();

    let _scopeType = _flowRuntime2.default.string();

    _flowRuntime2.default.param('strategy', _strategyType2).assert(strategy);

    _flowRuntime2.default.param('tokens', TokensObject).assert(tokens);

    _flowRuntime2.default.param('scope', _scopeType).assert(scope);

    if (strategy !== 'google') {
      throw new Error('Not supported at the moment');
    }

    const service = this.constructor.strategyToService[strategy];

    const profile = await service.getProfile(tokens);

    const plusProfile = await fetch(`https://www.googleapis.com/plus/v1/people/me?access_token=${tokens.accessToken}`).then(response => response.json());

    const emails = service.getEmails(profile, plusProfile);

    let user = await this.usersManager.findOneByAccountOrEmails({
      provider: service.providerKey,
      accountId: service.getId(profile),
      emails
    });

    logger.info(!user ? 'create user' : 'existing user', { emails, user });

    if (!user) {
      user = {};
    }

    Object.assign(user, {
      displayName: service.getDisplayName(profile),
      fullName: service.getFullName(profile),
      status: this.usersManager.STATUSES.VALIDATED
    });

    if (!user.accounts) user.accounts = [];

    const accountId = service.getId(profile);

    let account = user.accounts.find(account => account.provider === strategy && account.accountId === accountId);

    if (!account) {
      account = { provider: strategy, accountId };
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
    emails.forEach(email => {
      if (!userEmails.includes(email)) {
        userEmails.push(email);
      }
    });

    user.emailDomains = Array.from(user.emails.reduce((domains, email) => domains.add(email.split('@', 2)[1]), new Set()));

    const keyPath = _flowRuntime2.default.string().assert(this.usersManager.store.keyPath);
    await this.usersManager[user[keyPath] ? 'updateOne' : 'insertOne'](user);
    return user;
  }

  updateAccount(user, account) {
    return this.usersManager.updateAccount(user, account).then(() => user);
  }
}, _class.strategyToService = {
  google: _userAccountGoogleService2.default
}, _temp);
exports.default = UserAccountsService;
//# sourceMappingURL=UserAccountsService.js.map