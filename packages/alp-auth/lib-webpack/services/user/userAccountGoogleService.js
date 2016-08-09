var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global fetch */
import EventEmitter from 'events';

export default new (_temp2 = _class = function (_EventEmitter) {
    _inherits(UserAccountGoogleService, _EventEmitter);

    function UserAccountGoogleService() {
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, UserAccountGoogleService);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(UserAccountGoogleService)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.providerKey = 'google', _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(UserAccountGoogleService, [{
        key: 'getProfile',
        value: function getProfile(tokens) {
            return fetch('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + tokens.accessToken).then(function (response) {
                return response.json();
            });
        }
    }, {
        key: 'isAccount',
        value: function isAccount(account, profile) {
            return account.googleId === profile.id;
        }
    }, {
        key: 'getId',
        value: function getId(profile) {
            return profile.id;
        }
    }, {
        key: 'getAccountName',
        value: function getAccountName(profile) {
            return profile.email;
        }
    }, {
        key: 'getEmails',
        value: function getEmails(profile, plusProfile) {
            var emails = [];

            if (profile.email) {
                emails.push(profile.email);
            }

            if (plusProfile.emails) {
                plusProfile.emails.forEach(function (email) {
                    if (emails.indexOf(email.value) === -1) {
                        emails.push(email.value);
                    }
                });
            }

            return emails;
        }
    }, {
        key: 'getDisplayName',
        value: function getDisplayName(profile) {
            return profile.name;
        }
    }, {
        key: 'getFullName',
        value: function getFullName(profile) {
            return {
                givenName: profile.given_name,
                familyName: profile.family_name
            };
        }
    }, {
        key: 'getDefaultScope',
        value: function getDefaultScope(newScope) {
            return this.getScope(newScope);
        }
    }, {
        key: 'getScope',
        value: function getScope(oldScope, newScope) {
            return !oldScope ? newScope.split(' ') : oldScope.concat(newScope.split(' ')).filter(function (item, i, ar) {
                return ar.indexOf(item) === i;
            });
        }
    }]);

    return UserAccountGoogleService;
}(EventEmitter), _class.scopeKeyToScope = {
    login: 'openid profile email https://www.googleapis.com/auth/plus.profile.emails.read'
}, _temp2)();
//# sourceMappingURL=userAccountGoogleService.js.map