import { Tokens } from '../authentification/types';
import { AccountService } from './types';
export default class UserAccountGoogleService<ScopeKeys extends 'login'> implements AccountService<ScopeKeys> {
    scopeKeyToScope: Record<ScopeKeys, string>;
    constructor(scopeKeyToScope: Record<Exclude<'login', ScopeKeys>, string>);
    providerKey: string;
    getProfile(tokens: Tokens): Promise<any>;
    getId(profile: any): any;
    getAccountName(profile: any): any;
    getEmails(profile: any): string[];
    getDisplayName(profile: any): any;
    getFullName(profile: any): {
        givenName: any;
        familyName: any;
    };
    getDefaultScope(newScope: string): string[];
    getScope(oldScope: string[] | undefined, newScope: string): string[];
}
//# sourceMappingURL=UserAccountGoogleService.d.ts.map