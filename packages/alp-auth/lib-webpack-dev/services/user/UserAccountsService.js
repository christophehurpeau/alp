var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from 'tcomb-forked';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var logger = new Logger('alp:auth:userAccounts');

var UserAccountsService = function (_EventEmitter) {
  _inherits(UserAccountsService, _EventEmitter);

  function UserAccountsService(usersManager) {
    _classCallCheck(this, UserAccountsService);

    var _this = _possibleConstructorReturn(this, (UserAccountsService.__proto__ || Object.getPrototypeOf(UserAccountsService)).call(this));

    _this.usersManager = usersManager;
    return _this;
  }

  _createClass(UserAccountsService, [{
    key: 'getScope',
    value: function getScope(strategy, scopeKey, user, accountId) {
      _assert(strategy, _t.String, 'strategy');

      _assert(scopeKey, _t.String, 'scopeKey');

      logger.debug('getScope', { strategy: strategy, userId: user && user._id });
      var service = this.constructor.strategyToService[strategy];
      var newScope = service.constructor.scopeKeyToScope[scopeKey];
      if (!user || !accountId) {
        return newScope;
      }
      var account = user.accounts.find(function (account) {
        return account.provider === strategy && account.accountId === accountId;
      });

      if (!account) {
        throw new Error('Could not found associated account');
      }
      return service.getScope(account.scope, newScope).join(' ');
    }
  }, {
    key: 'update',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(user, strategy, tokens, scope, subservice) {
        var service, profile, account;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                service = this.constructor.strategyToService[strategy];
                _context.next = 3;
                return service.getProfile(tokens);

              case 3:
                profile = _context.sent;
                account = user.accounts.find(function (account) {
                  return account.provider === strategy && service.isAccount(account, profile);
                });

                if (account) {
                  _context.next = 7;
                  break;
                }

                throw new Error('Could not found associated account');

              case 7:
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

                _context.next = 16;
                return this.usersManager.update(user);

              case 16:
                return _context.abrupt('return', user);

              case 17:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function update(_x, _x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: 'findOrCreateFromGoogle',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(strategy, tokens, scope, subservice) {
        var service, profile, plusProfile, emails, user, accountId, account, userEmails, keyPath;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _assert(strategy, _t.String, 'strategy');

                _assert(tokens, TokensObject, 'tokens');

                _assert(scope, _t.String, 'scope');

                if (!(strategy !== 'google')) {
                  _context2.next = 5;
                  break;
                }

                throw new Error('Not supported at the moment');

              case 5:
                service = this.constructor.strategyToService[strategy];
                _context2.next = 8;
                return service.getProfile(tokens);

              case 8:
                profile = _context2.sent;
                _context2.next = 11;
                return fetch('https://www.googleapis.com/plus/v1/people/me?access_token=' + tokens.accessToken).then(function (response) {
                  return response.json();
                });

              case 11:
                plusProfile = _context2.sent;
                emails = service.getEmails(profile, plusProfile);
                _context2.next = 15;
                return this.usersManager.findOneByAccountOrEmails({
                  provider: service.providerKey,
                  accountId: service.getId(profile),
                  emails: emails
                });

              case 15:
                user = _context2.sent;


                logger.info('create user', { emails: emails, user: user });

                if (!user) {
                  user = {};
                }

                Object.assign(user, {
                  displayName: service.getDisplayName(profile),
                  fullName: service.getFullName(profile),
                  status: this.usersManager.STATUSES.VALIDATED
                });

                if (!user.accounts) user.accounts = [];

                accountId = service.getId(profile);
                account = user.accounts.find(function (account) {
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
                userEmails = user.emails;

                emails.forEach(function (email) {
                  if (!userEmails.includes(email)) {
                    userEmails.push(email);
                  }
                });

                user.emailDomains = Array.from(user.emails.reduce(function (domains, email) {
                  return domains.add(email.split('@', 2)[1]);
                }, new Set()));

                keyPath = this.usersManager.store.keyPath;
                _context2.next = 39;
                return this.usersManager[user[keyPath] ? 'updateOne' : 'insertOne'](user);

              case 39:
                return _context2.abrupt('return', user);

              case 40:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function findOrCreateFromGoogle(_x6, _x7, _x8, _x9) {
        return _ref2.apply(this, arguments);
      }

      return findOrCreateFromGoogle;
    }()
  }, {
    key: 'updateAccount',
    value: function updateAccount(user, account) {
      return this.usersManager.updateAccount(user, account).then(function () {
        return user;
      });
    }
  }]);

  return UserAccountsService;
}(EventEmitter);

UserAccountsService.strategyToService = {
  google: userAccountGoogleService
};
export default UserAccountsService;

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
//# sourceMappingURL=UserAccountsService.js.map