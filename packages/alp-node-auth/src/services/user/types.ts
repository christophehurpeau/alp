export interface FullName {
  givenName: string;
  familyName: string;
}

export interface TokensObject {
  accessToken: string;
  expireDate: Date;
  idToken: string;
  refreshToken?: string;
  tokenType: string;
}

export interface AccountService<ScopeKeys extends 'login'> {
  scopeKeyToScope: Record<ScopeKeys, string>;
  providerKey: string;

  getProfile(tokens: TokensObject): any;
  getId(profile: any): any;
  getAccountName(profile: any): string;
  getEmails(profile: any): string[];
  getDisplayName(profile: any): string | null;
  getFullName(profile: any): FullName | null;
  getDefaultScope(newScope: string): string[];
  getScope(oldScope: string[] | undefined, newScope: string): string[];
}
