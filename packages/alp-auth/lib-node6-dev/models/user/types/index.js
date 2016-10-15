"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserBrowserType = exports.AccountBrowserType = exports.UserType = exports.AccountType = exports.UserNameType = undefined;

var _tcombForked = require("tcomb-forked");

var _tcombForked2 = _interopRequireDefault(_tcombForked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserNameType = exports.UserNameType = _tcombForked2.default.interface({
  givenName: _tcombForked2.default.String,
  familyName: _tcombForked2.default.String
}, "UserNameType");

const AccountType = exports.AccountType = _tcombForked2.default.interface({
  provider: _tcombForked2.default.String,
  accountId: _tcombForked2.default.String,
  name: _tcombForked2.default.String,
  status: _tcombForked2.default.String,
  accessToken: _tcombForked2.default.String,
  tokenExpireDate: Date,
  refreshToken: _tcombForked2.default.maybe(_tcombForked2.default.String),
  profile: _tcombForked2.default.maybe(_tcombForked2.default.Object),
  scope: _tcombForked2.default.list(_tcombForked2.default.String)
}, "AccountType");

const UserType = exports.UserType = _tcombForked2.default.interface({
  displayName: _tcombForked2.default.String,
  fullName: UserNameType,
  status: _tcombForked2.default.String,
  emails: _tcombForked2.default.list(_tcombForked2.default.String),
  emailDomains: _tcombForked2.default.list(_tcombForked2.default.String),
  accounts: _tcombForked2.default.list(AccountType)
}, "UserType");

const AccountBrowserType = exports.AccountBrowserType = _tcombForked2.default.interface({
  provider: _tcombForked2.default.String,
  accountId: _tcombForked2.default.String,
  name: _tcombForked2.default.String,
  status: _tcombForked2.default.String
}, "AccountBrowserType");

const UserBrowserType = exports.UserBrowserType = _tcombForked2.default.interface({
  displayName: _tcombForked2.default.String,
  fullName: UserNameType,
  status: _tcombForked2.default.String,
  emails: _tcombForked2.default.list(_tcombForked2.default.String),
  emailDomains: _tcombForked2.default.list(_tcombForked2.default.String),
  accounts: _tcombForked2.default.list(AccountBrowserType)
}, "UserBrowserType");
//# sourceMappingURL=index.js.map