var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import MongoStore from 'liwi/mongo';
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
        value: function findOneByAccountOrEmails(_ref) {
            var provider = _ref.provider;
            var accountId = _ref.accountId;
            var emails = _ref.emails;

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

            return this.store.findOne(query);
        }
    }, {
        key: 'findConnected',
        value: function findConnected(connected) {
            return this.store.findByKey(connected);
        }
    }, {
        key: 'insertOne',
        value: function insertOne(user) {
            return this.store.insertOne(user);
        }
    }, {
        key: 'updateOne',
        value: function updateOne(user) {
            return this.store.updateOne(user);
        }
    }, {
        key: 'updateAccount',
        value: function updateAccount(user, account) {
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
                        status: account.status
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
//# sourceMappingURL=UsersManager.js.map