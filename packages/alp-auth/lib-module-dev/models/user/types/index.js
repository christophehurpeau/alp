import t from "flow-runtime";
export var UserNameType = t.type("UserNameType", t.object(t.property("givenName", t.string()), t.property("familyName", t.string())));

export var AccountType = t.type("AccountType", t.object(t.property("provider", t.string()), t.property("accountId", t.string()), t.property("name", t.string()), t.property("status", t.string()), t.property("accessToken", t.string()), t.property("tokenExpireDate", t.ref("Date")), t.property("refreshToken", t.string(), true), t.property("profile", t.object(), true), t.property("scope", t.array(t.string()))));

export var UserType = t.type("UserType", t.object(t.property("displayName", t.string()), t.property("fullName", UserNameType), t.property("status", t.string()), t.property("emails", t.array(t.string())), t.property("emailDomains", t.array(t.string())), t.property("accounts", t.array(AccountType))));

export var AccountBrowserType = t.type("AccountBrowserType", t.object(t.property("provider", t.string()), t.property("accountId", t.string()), t.property("name", t.string()), t.property("status", t.string())));

export var UserBrowserType = t.type("UserBrowserType", t.object(t.property("displayName", t.string()), t.property("fullName", UserNameType), t.property("status", t.string()), t.property("emails", t.array(t.string())), t.property("emailDomains", t.array(t.string())), t.property("accounts", t.array(AccountBrowserType))));
//# sourceMappingURL=index.js.map