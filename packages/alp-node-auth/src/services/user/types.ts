export interface FullName {
  givenName: string;
  familyName: string;
}

export interface TokensObject {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  expireDate: Date | null;
  idToken: string;
}

export interface AccountService<ScopeKeys extends 'login'> {
  scopeKeyToScope: Record<ScopeKeys, string>;
  providerKey: string;

  getProfile: (tokens: TokensObject) => Promise<any>;
  getId: (profile: any) => any;
  getAccountName: (profile: any) => string | null | undefined;
  getEmails: (profile: any) => string[];
  getDisplayName: (profile: any) => string | null | undefined;
  getFullName: (profile: any) => FullName | null;
  getDefaultScope: (newScope: string) => string[];
  getScope: (oldScope: string[] | undefined, newScope: string) => string[];
}
