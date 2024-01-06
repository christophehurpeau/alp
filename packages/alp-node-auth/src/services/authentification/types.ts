export type GoogleParams =
  | 'access_type'
  | 'include_granted_scopes'
  | 'login_hint'
  | 'prompt';
export type SlackParams = 'client_id' | 'team';

export type AllowedStrategyKeys = 'google' | 'slack';

export interface AllowedMapParamsStrategy {
  google: GoogleParams;
  slack: SlackParams;
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  expireDate: Date | null;
  idToken: string;
}
