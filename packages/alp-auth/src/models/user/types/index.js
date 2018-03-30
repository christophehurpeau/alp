export type UserNameType = {
  familyName: string,
  givenName: string,
};

export type AccountType = {
  accessToken: string,
  accountId: string,
  name: string,
  profile?: Object,
  provider: string,
  refreshToken?: string,
  scope: Array<string>,
  status: string,
  tokenExpireDate: Date,
};

export type UserType = {
  _id?: string,
  accounts: Array<AccountType>,
  displayName: string,
  emailDomains: Array<string>,
  emails: Array<string>,
  fullName: UserNameType,
  id?: string,
  status: string,
};

export type AccountBrowserType = {
  accountId: string,
  name: string,
  provider: string,
  status: string,
};

export type UserBrowserType = {
  _id?: string,
  accounts: Array<AccountBrowserType>,
  displayName: string,
  emailDomains: Array<string>,
  emails: Array<string>,
  fullName: UserNameType,
  id?: string,
  status: string,
};
