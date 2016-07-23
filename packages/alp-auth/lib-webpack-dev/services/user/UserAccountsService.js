var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global fetch */
import EventEmitter from 'events';
import Logger from 'nightingale-logger';
import UsersManager from '../../models/user/UsersManager';
import userAccountGoogleService from './userAccountGoogleService';

var TokensObject = function () {
    function TokensObject(input) {
        return input != null && typeof input.accessToken === 'string' && (input.refreshToken === undefined || typeof input.refreshToken === 'string');
    }

    ;
    Object.defineProperty(TokensObject, Symbol.hasInstance, {
        value: function value(input) {
            return TokensObject(input);
        }
    });
    return TokensObject;
}();

var logger = new Logger('alp-auth.services.userAccounts');

var UserAccountsService = function (_EventEmitter) {
    _inherits(UserAccountsService, _EventEmitter);

    function UserAccountsService(usersManager) {
        _classCallCheck(this, UserAccountsService);

        if (!(usersManager instanceof UsersManager)) {
            throw new TypeError('Value of argument "usersManager" violates contract.\n\nExpected:\nUsersManager\n\nGot:\n' + _inspect(usersManager));
        }

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(UserAccountsService).call(this));

        _this.usersManager = usersManager;
        return _this;
    }

    _createClass(UserAccountsService, [{
        key: 'getScope',
        value: function getScope(strategy, scopeKey, user, accountId) {
            if (!(typeof strategy === 'string')) {
                throw new TypeError('Value of argument "strategy" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(strategy));
            }

            if (!(typeof scopeKey === 'string')) {
                throw new TypeError('Value of argument "scopeKey" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(scopeKey));
            }

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
                                if (typeof strategy === 'string') {
                                    _context2.next = 2;
                                    break;
                                }

                                throw new TypeError('Value of argument "strategy" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(strategy));

                            case 2:
                                if (TokensObject(tokens)) {
                                    _context2.next = 4;
                                    break;
                                }

                                throw new TypeError('Value of argument "tokens" violates contract.\n\nExpected:\nTokensObject\n\nGot:\n' + _inspect(tokens));

                            case 4:
                                if (typeof scope === 'string') {
                                    _context2.next = 6;
                                    break;
                                }

                                throw new TypeError('Value of argument "scope" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(scope));

                            case 6:
                                if (!(strategy !== 'google')) {
                                    _context2.next = 8;
                                    break;
                                }

                                throw new Error('Not supported at the moment');

                            case 8:
                                service = this.constructor.strategyToService[strategy];
                                _context2.next = 11;
                                return service.getProfile(tokens);

                            case 11:
                                profile = _context2.sent;
                                _context2.next = 14;
                                return fetch('https://www.googleapis.com/plus/v1/people/me?access_token=' + tokens.accessToken).then(function (response) {
                                    return response.json();
                                });

                            case 14:
                                plusProfile = _context2.sent;
                                emails = service.getEmails(profile, plusProfile);
                                _context2.next = 18;
                                return this.usersManager.findOneByAccountOrEmails({
                                    provider: service.providerKey,
                                    accountId: service.getId(profile),
                                    emails: emails
                                });

                            case 18:
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

                                _context2.next = 39;
                                return this.usersManager[user._id ? 'updateOne' : 'insertOne'](user);

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

function _inspect(input, depth) {
    var maxDepth = 4;
    var maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === 'undefined' ? 'undefined' : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(function (item) {
                    return _inspect(item, depth) === first;
                })) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(function (item) {
                            return _inspect(item, depth);
                        }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        var indent = '  '.repeat(depth - 1);
        var entries = keys.slice(0, maxKeys).map(function (key) {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=UserAccountsService.js.map