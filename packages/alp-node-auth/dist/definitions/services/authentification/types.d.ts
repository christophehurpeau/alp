import type { GoogleParams, SlackParams } from 'alp-types';
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
//# sourceMappingURL=types.d.ts.map