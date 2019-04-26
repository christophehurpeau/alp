export type AllowedStrategyKeys = 'google' | 'slack';

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: string;
  expireDate: Date;
  idToken: string;
}
