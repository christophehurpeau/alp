import type { MongoBaseModel } from 'liwi-mongo';

export interface UserName {
  familyName: string;
  givenName: string;
}

export type AccountId = string;

export interface Account {
  accessToken: string;
  accountId: AccountId;
  name?: string | null;
  profile?: any;
  provider: string;
  refreshToken?: string;
  scope: string[];
  subservices?: string[];
  status: string;
  tokenExpireDate: Date;
}

export interface User extends MongoBaseModel {
  accounts: Account[];
  displayName: string;
  emailDomains: string[];
  emails: string[];
  fullName: UserName;
  status: string;
}

export interface AccountSanitized {
  accountId: string;
  name?: string | null;
  provider: string;
  status: string;
  profile?: any;
}

export interface UserSanitized extends MongoBaseModel {
  accounts: AccountSanitized[];
  displayName: string;
  emailDomains: string[];
  emails: string[];
  fullName: UserName;
  status: string;
}
