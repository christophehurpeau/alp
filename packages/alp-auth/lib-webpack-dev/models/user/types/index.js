import _t from "tcomb-forked";
export var UserNameType = _t.interface({
  givenName: _t.String,
  familyName: _t.String
}, "UserNameType");

export var AccountType = _t.interface({
  provider: _t.String,
  accountId: _t.String,
  name: _t.String,
  status: _t.String,
  accessToken: _t.String,
  tokenExpireDate: Date,
  refreshToken: _t.maybe(_t.String),
  profile: _t.maybe(_t.Object),
  scope: _t.list(_t.String)
}, "AccountType");

export var UserType = _t.interface({
  displayName: _t.String,
  fullName: UserNameType,
  status: _t.String,
  emails: _t.list(_t.String),
  accounts: _t.list(AccountType)
}, "UserType");

export var AccountBrowserType = _t.interface({
  provider: _t.String,
  accountId: _t.String,
  name: _t.String,
  status: _t.String
}, "AccountBrowserType");

export var UserBrowserType = _t.interface({
  displayName: _t.String,
  fullName: UserNameType,
  status: _t.String,
  emails: _t.list(_t.String),
  accounts: _t.list(AccountBrowserType)
}, "UserBrowserType");
//# sourceMappingURL=index.js.map