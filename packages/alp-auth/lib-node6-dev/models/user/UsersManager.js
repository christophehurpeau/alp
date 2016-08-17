'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _liwi = require('liwi');

var _types = require('./types');

class UsersManager extends _liwi.AbstractManager {
    constructor() {
        var _temp;

        return _temp = super(...arguments), this.STATUSES = UsersManager.STATUSES, _temp;
    }

    findOneByAccountOrEmails(_ref5) {
        let provider = _ref5.provider;
        let accountId = _ref5.accountId;
        let emails = _ref5.emails;

        function _ref(_id) {
            if (!(_id instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<?UserType>\n\nGot:\n' + _inspect(_id));
            }

            return _id;
        }

        if (!(arguments[0] != null && typeof arguments[0].provider === 'string' && (typeof arguments[0].accountId === 'string' || typeof arguments[0].accountId === 'number') && (arguments[0].emails == null || Array.isArray(arguments[0].emails) && arguments[0].emails.every(function (item) {
            return typeof item === 'string';
        })))) {
            throw new TypeError('Value of argument 0 violates contract.\n\nExpected:\n{\n  provider: string;\n  accountId: string | number;\n  emails: ?Array<string>;\n}\n\nGot:\n' + _inspect(arguments[0]));
        }

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

        return _ref(this.store.findOne(query));
    }

    findConnected(connected) {
        function _ref2(_id2) {
            if (!(_id2 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<?UserType>\n\nGot:\n' + _inspect(_id2));
            }

            return _id2;
        }

        return _ref2(this.store.findByKey(connected));
    }

    insertOne(user) {
        function _ref3(_id3) {
            if (!(_id3 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id3));
            }

            return _id3;
        }

        return _ref3(this.store.insertOne(user));
    }

    updateOne(user) {
        function _ref4(_id4) {
            if (!(_id4 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id4));
            }

            return _id4;
        }

        return _ref4(this.store.updateOne(user));
    }

    updateAccount(user, account) {
        if (!(user instanceof _types.UserType)) {
            throw new TypeError('Value of argument "user" violates contract.\n\nExpected:\nUserType\n\nGot:\n' + _inspect(user));
        }

        if (!(account instanceof _types.AccountType)) {
            throw new TypeError('Value of argument "account" violates contract.\n\nExpected:\nAccountType\n\nGot:\n' + _inspect(account));
        }

        let accountIndex = user.accounts.indexOf(account);
        return this.store.partialUpdateOne(user, { [`accounts.${ accountIndex }`]: account });
    }

    transformForBrowser(user) {
        return {
            displayName: user.displayName,
            fullName: user.fullName,
            status: user.status,
            emails: user.emails,
            accounts: user.accounts.map(account => {
                return {
                    provider: account.provider,
                    accountId: account.accountId,
                    name: account.name,
                    status: account.status,
                    profile: account.profile
                };
            })
        };
    }
}
exports.default = UsersManager;
UsersManager.STATUSES = {
    VALIDATED: 'validated',
    DELETED: 'deleted'
};

function _inspect(input, depth) {
    const maxDepth = 4;
    const maxKeys = 15;

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
            if (depth > maxDepth) return '[...]';

            const first = _inspect(input[0], depth);

            if (input.every(item => _inspect(item, depth) === first)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        const keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        const indent = '  '.repeat(depth - 1);
        let entries = keys.slice(0, maxKeys).map(key => {
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
//# sourceMappingURL=UsersManager.js.map