import type { Tokens } from '../authentification/types';
import type { AccountService, FullName } from './types';
export default class UserAccountGoogleService<ScopeKeys extends 'login'> implements AccountService<ScopeKeys> {
    scopeKeyToScope: Record<ScopeKeys, string>;
    constructor(scopeKeyToScope: Record<Exclude<'login', ScopeKeys>, string>);
    providerKey: string;
    getProfile(tokens: Tokens): Promise<any>;
    getId(profile: any): any;
    getAccountName(profile: any): string | null | undefined;
    getEmails(profile: any): string[];
    getDisplayName(profile: any): string | null | undefined;
    getFullName(profile: any): FullName;
    getDefaultScope(newScope: string): string[];
    getScope(oldScope: string[] | undefined, newScope: string): string[];
}
//# sourceMappingURL=UserAccountGoogleService.d.ts.map