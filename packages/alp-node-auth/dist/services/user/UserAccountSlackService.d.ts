import { Tokens } from '../authentification/types';
import { AccountService } from './types';
export default class UserAccountSlackService<ScopeKeys extends 'login'> implements AccountService<ScopeKeys> {
    scopeKeyToScope: Record<ScopeKeys, string>;
    constructor(scopeKeyToScope: Record<Exclude<'login', ScopeKeys>, string>);
    providerKey: string;
    getProfile(tokens: Tokens): Promise<any>;
    getId(profile: any): string | null;
    getAccountName(profile: any): any;
    getEmails(profile: any): any[];
    getDisplayName(profile: any): any;
    getFullName(profile: any): null;
    getDefaultScope(newScope: string): string[];
    getScope(oldScope: string[] | undefined, newScope: string): string[];
}
//# sourceMappingURL=UserAccountSlackService.d.ts.map