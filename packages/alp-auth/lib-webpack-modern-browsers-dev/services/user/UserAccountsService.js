function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

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

export default class UserAccountsService extends EventEmitter {

    constructor(usersManager) {
        if (!(usersManager instanceof UsersManager)) {
            throw new TypeError('Value of argument "usersManager" violates contract.\n\nExpected:\nUsersManager\n\nGot:\n' + _inspect(usersManager));
        }

        super();
        this.usersManager = usersManager;
    }

    getScope(strategy, scopeKey, user, accountId) {
        if (!(typeof strategy === 'string')) {
            throw new TypeError('Value of argument "strategy" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(strategy));
        }

        if (!(typeof scopeKey === 'string')) {
            throw new TypeError('Value of argument "scopeKey" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(scopeKey));
        }

        logger.debug('getScope', { strategy, userId: user && user._id });
        var service = this.constructor.strategyToService[strategy];
        var newScope = service.constructor.scopeKeyToScope[scopeKey];
        if (!user || !accountId) {
            return newScope;
        }
        var account = user.accounts.find(account => {
            return account.provider === strategy && account.accountId === accountId;
        });

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

    /**
     * @param  {Object} profile
     * @param  {String} token
     * @param  {String} tokenSecret
     * @return {Promise}
     */
    findOrCreateFromGoogle(strategy, tokens, scope, subservice) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            if (!(typeof strategy === 'string')) {
                throw new TypeError('Value of argument "strategy" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(strategy));
            }

            if (!TokensObject(tokens)) {
                throw new TypeError('Value of argument "tokens" violates contract.\n\nExpected:\nTokensObject\n\nGot:\n' + _inspect(tokens));
            }

            if (!(typeof scope === 'string')) {
                throw new TypeError('Value of argument "scope" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(scope));
            }

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

            yield _this2.usersManager[user._id ? 'updateOne' : 'insertOne'](user);
            return user;
        })();
    }

    updateAccount(user, account) {
        return this.usersManager.updateAccount(user, account).then(() => {
            return user;
        });
    }
}
UserAccountsService.strategyToService = {
    google: userAccountGoogleService
};

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
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(item => _inspect(item, depth) === first)) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if (typeof _ret === "object") return _ret.v;
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
        var entries = keys.slice(0, maxKeys).map(key => {
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