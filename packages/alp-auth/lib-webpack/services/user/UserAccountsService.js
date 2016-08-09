var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global fetch */
import EventEmitter from 'events';
import Logger from 'nightingale-logger';
import UsersManager from '../../models/user/UsersManager';
import userAccountGoogleService from './userAccountGoogleService';

var logger = new Logger('alp-auth.services.userAccounts');

var UserAccountsService = function (_EventEmitter) {
    _inherits(UserAccountsService, _EventEmitter);

    function UserAccountsService(usersManager) {
        _classCallCheck(this, UserAccountsService);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(UserAccountsService).call(this));

        _this.usersManager = usersManager;
        return _this;
    }

    _createClass(UserAccountsService, [{
        key: 'getScope',
        value: function getScope(strategy, scopeKey, user, accountId) {
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
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(user, strategy, tokens, scope, subservice) {
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
                return ref.apply(this, arguments);
            }

            return update;
        }()

        /**
         * @param  {Object} profile
         * @param  {String} token
         * @param  {String} tokenSecret
         * @return {Promise}
         */

    }, {
        key: 'findOrCreateFromGoogle',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(strategy, tokens, scope, subservice) {
                var service, profile, plusProfile, emails, user, accountId, account, userEmails;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(strategy !== 'google')) {
                                    _context2.next = 2;
                                    break;
                                }

                                throw new Error('Not supported at the moment');

                            case 2:
                                service = this.constructor.strategyToService[strategy];
                                _context2.next = 5;
                                return service.getProfile(tokens);

                            case 5:
                                profile = _context2.sent;
                                _context2.next = 8;
                                return fetch('https://www.googleapis.com/plus/v1/people/me?access_token=' + tokens.accessToken).then(function (response) {
                                    return response.json();
                                });

                            case 8:
                                plusProfile = _context2.sent;
                                emails = service.getEmails(profile, plusProfile);
                                _context2.next = 12;
                                return this.usersManager.findOneByAccountOrEmails({
                                    provider: service.providerKey,
                                    accountId: service.getId(profile),
                                    emails: emails
                                });

                            case 12:
                                user = _context2.sent;


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

                                _context2.next = 33;
                                return this.usersManager[user._id ? 'updateOne' : 'insertOne'](user);

                            case 33:
                                return _context2.abrupt('return', user);

                            case 34:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function findOrCreateFromGoogle(_x6, _x7, _x8, _x9) {
                return ref.apply(this, arguments);
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
//# sourceMappingURL=UserAccountsService.js.map