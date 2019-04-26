/* global fetch */
import { Tokens } from '../authentification/types';
import { AccountService } from './types';

export default class UserAccountGoogleService<ScopeKeys extends 'login'>
  implements AccountService<ScopeKeys> {
  scopeKeyToScope: Record<ScopeKeys, string>;

  constructor(scopeKeyToScope: Record<Exclude<'login', ScopeKeys>, string>) {
    this.scopeKeyToScope = {
      ...scopeKeyToScope,
      login: 'openid profile email',
    };
  }

  providerKey = 'google';

  getProfile(tokens: Tokens) {
    return fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${
        tokens.accessToken
      }`,
    ).then((response) => response.json());
  }

  getId(profile: any) {
    return profile.id;
  }

  getAccountName(profile: any) {
    return profile.email;
  }

  getEmails(profile: any) {
    const emails: string[] = [];

    if (profile.email) {
      emails.push(profile.email);
    }

    return emails;
  }

  getDisplayName(profile: any) {
    return profile.name;
  }

  getFullName(profile: any) {
    return {
      givenName: profile.given_name,
      familyName: profile.family_name,
    };
  }

  getDefaultScope(newScope: string) {
    return this.getScope(undefined, newScope);
  }

  getScope(oldScope: string[] | undefined, newScope: string) {
    return !oldScope
      ? newScope.split(' ')
      : oldScope
          .concat(newScope.split(' '))
          .filter((item: any, i: any, ar: string[]) => ar.indexOf(item) === i);
  }
}