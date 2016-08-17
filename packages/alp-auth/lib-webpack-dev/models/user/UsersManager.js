var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { AbstractManager } from 'liwi';
import { UserType, AccountType } from './types';

var UsersManager = function (_AbstractManager) {
    _inherits(UsersManager, _AbstractManager);

    function UsersManager() {
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, UsersManager);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(UsersManager)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.STATUSES = UsersManager.STATUSES, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(UsersManager, [{
        key: 'findOneByAccountOrEmails',
        value: function findOneByAccountOrEmails(_ref5) {
            var provider = _ref5.provider;
            var accountId = _ref5.accountId;
            var emails = _ref5.emails;

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

            var query = {
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
    }, {
        key: 'findConnected',
        value: function findConnected(connected) {
            function _ref2(_id2) {
                if (!(_id2 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<?UserType>\n\nGot:\n' + _inspect(_id2));
                }

                return _id2;
            }

            return _ref2(this.store.findByKey(connected));
        }
    }, {
        key: 'insertOne',
        value: function insertOne(user) {
            function _ref3(_id3) {
                if (!(_id3 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id3));
                }

                return _id3;
            }

            return _ref3(this.store.insertOne(user));
        }
    }, {
        key: 'updateOne',
        value: function updateOne(user) {
            function _ref4(_id4) {
                if (!(_id4 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id4));
                }

                return _id4;
            }

            return _ref4(this.store.updateOne(user));
        }
    }, {
        key: 'updateAccount',
        value: function updateAccount(user, account) {
            if (!(user instanceof UserType)) {
                throw new TypeError('Value of argument "user" violates contract.\n\nExpected:\nUserType\n\nGot:\n' + _inspect(user));
            }

            if (!(account instanceof AccountType)) {
                throw new TypeError('Value of argument "account" violates contract.\n\nExpected:\nAccountType\n\nGot:\n' + _inspect(account));
            }

            var accountIndex = user.accounts.indexOf(account);
            return this.store.partialUpdateOne(user, _defineProperty({}, 'accounts.' + accountIndex, account));
        }
    }, {
        key: 'transformForBrowser',
        value: function transformForBrowser(user) {
            return {
                displayName: user.displayName,
                fullName: user.fullName,
                status: user.status,
                emails: user.emails,
                accounts: user.accounts.map(function (account) {
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
    }]);

    return UsersManager;
}(AbstractManager);

UsersManager.STATUSES = {
    VALIDATED: 'validated',
    DELETED: 'deleted'
};
export default UsersManager;

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
            var _ret2 = function () {
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

            if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
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
//# sourceMappingURL=UsersManager.js.map