import { MongoModel } from 'liwi-mongo';

/* eslint-disable no-restricted-globals */
export interface UserName {
  familyName: string;
  givenName: string;
}

export type AccountId = string;

export interface Account {
  accessToken: string;
  accountId: AccountId;
  name: string;
  profile?: any;
  provider: string;
  refreshToken?: string;
  scope: string[];
  subservices?: string[];
  status: string;
  tokenExpireDate: Date;
}

export interface User extends MongoModel {
  accounts: Account[];
  displayName: string;
  emailDomains: string[];
  emails: string[];
  fullName: UserName;
  status: string;
}

export interface AccountSanitized {
  accountId: string;
  name: string;
  provider: string;
  status: string;
  profile?: any;
}

export interface UserSanitized extends MongoModel {
  accounts: AccountSanitized[];
  displayName: string;
  emailDomains: string[];
  emails: string[];
  fullName: UserName;
  status: string;
}
