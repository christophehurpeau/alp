"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserBrowserType = exports.AccountBrowserType = exports.UserType = exports.AccountType = exports.UserNameType = undefined;

var _flowRuntime = require("flow-runtime");

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserNameType = exports.UserNameType = _flowRuntime2.default.type("UserNameType", _flowRuntime2.default.object(_flowRuntime2.default.property("givenName", _flowRuntime2.default.string()), _flowRuntime2.default.property("familyName", _flowRuntime2.default.string())));

const AccountType = exports.AccountType = _flowRuntime2.default.type("AccountType", _flowRuntime2.default.object(_flowRuntime2.default.property("provider", _flowRuntime2.default.string()), _flowRuntime2.default.property("accountId", _flowRuntime2.default.string()), _flowRuntime2.default.property("name", _flowRuntime2.default.string()), _flowRuntime2.default.property("status", _flowRuntime2.default.string()), _flowRuntime2.default.property("accessToken", _flowRuntime2.default.string()), _flowRuntime2.default.property("tokenExpireDate", _flowRuntime2.default.ref("Date")), _flowRuntime2.default.property("refreshToken", _flowRuntime2.default.string(), true), _flowRuntime2.default.property("profile", _flowRuntime2.default.object(), true), _flowRuntime2.default.property("scope", _flowRuntime2.default.array(_flowRuntime2.default.string()))));

const UserType = exports.UserType = _flowRuntime2.default.type("UserType", _flowRuntime2.default.object(_flowRuntime2.default.property("displayName", _flowRuntime2.default.string()), _flowRuntime2.default.property("fullName", UserNameType), _flowRuntime2.default.property("status", _flowRuntime2.default.string()), _flowRuntime2.default.property("emails", _flowRuntime2.default.array(_flowRuntime2.default.string())), _flowRuntime2.default.property("emailDomains", _flowRuntime2.default.array(_flowRuntime2.default.string())), _flowRuntime2.default.property("accounts", _flowRuntime2.default.array(AccountType))));

const AccountBrowserType = exports.AccountBrowserType = _flowRuntime2.default.type("AccountBrowserType", _flowRuntime2.default.object(_flowRuntime2.default.property("provider", _flowRuntime2.default.string()), _flowRuntime2.default.property("accountId", _flowRuntime2.default.string()), _flowRuntime2.default.property("name", _flowRuntime2.default.string()), _flowRuntime2.default.property("status", _flowRuntime2.default.string())));

const UserBrowserType = exports.UserBrowserType = _flowRuntime2.default.type("UserBrowserType", _flowRuntime2.default.object(_flowRuntime2.default.property("displayName", _flowRuntime2.default.string()), _flowRuntime2.default.property("fullName", UserNameType), _flowRuntime2.default.property("status", _flowRuntime2.default.string()), _flowRuntime2.default.property("emails", _flowRuntime2.default.array(_flowRuntime2.default.string())), _flowRuntime2.default.property("emailDomains", _flowRuntime2.default.array(_flowRuntime2.default.string())), _flowRuntime2.default.property("accounts", _flowRuntime2.default.array(AccountBrowserType))));
//# sourceMappingURL=index.js.map