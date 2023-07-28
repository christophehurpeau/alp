/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Tokens } from '../authentification/types';
import type { AccountService, FullName } from './types';

export default class UserAccountGoogleService<ScopeKeys extends 'login'>
  implements AccountService<ScopeKeys>
{
  scopeKeyToScope: Record<ScopeKeys, string>;

  constructor(scopeKeyToScope: Record<Exclude<'login', ScopeKeys>, string>) {
    this.scopeKeyToScope = {
      ...scopeKeyToScope,
      login: 'openid profile email',
    };
  }

  providerKey = 'google';

  getProfile(tokens: Tokens): Promise<any> {
    return fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokens.accessToken}`,
    ).then((response) => response.json());
  }

  getId(profile: any): any {
    return profile.id;
  }

  getAccountName(profile: any): string | null | undefined {
    return profile.email;
  }

  getEmails(profile: any): string[] {
    const emails: string[] = [];

    if (profile.email) {
      emails.push(profile.email);
    }

    return emails;
  }

  getDisplayName(profile: any): string | null | undefined {
    return profile.name;
  }

  getFullName(profile: any): FullName {
    return {
      givenName: profile.given_name,
      familyName: profile.family_name,
    };
  }

  getDefaultScope(newScope: string): string[] {
    return this.getScope(undefined, newScope);
  }

  getScope(oldScope: string[] | undefined, newScope: string): string[] {
    return !oldScope
      ? newScope.split(' ')
      : [...oldScope, ...newScope.split(' ')].filter(
          (item, i, ar) => ar.indexOf(item) === i,
        );
  }
}
