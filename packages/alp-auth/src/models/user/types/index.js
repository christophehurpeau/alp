export type UserNameType = {
  givenName: string,
  familyName: string,
};

export type AccountType = {
  provider: string,
  accountId: string,
  name: string,
  status: string,
  accessToken: string,
  tokenExpireDate: Date,
  refreshToken?: string,
  profile?: Object,
  scope: Array<string>,
};

export type UserType = {
  id?: string,
  _id?: string,
  displayName: string,
  fullName: UserNameType,
  status: string,
  emails: Array<string>,
  emailDomains: Array<string>,
  accounts: Array<AccountType>,
};

export type AccountBrowserType = {
  provider: string,
  accountId: string,
  name: string,
  status: string,
};

export type UserBrowserType = {
  id?: string,
  _id?: string,
  displayName: string,
  fullName: UserNameType,
  status: string,
  emails: Array<string>,
  emailDomains: Array<string>,
  accounts: Array<AccountBrowserType>,
};
