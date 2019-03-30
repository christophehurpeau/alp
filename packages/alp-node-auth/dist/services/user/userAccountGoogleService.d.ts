/// <reference types="node" />
import { Tokens } from '../authentification/types';
declare const _default: {
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
    addListener(event: string | symbol, listener: (...args: any[]) => void): any;
    on(event: string | symbol, listener: (...args: any[]) => void): any;
    once(event: string | symbol, listener: (...args: any[]) => void): any;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): any;
    off(event: string | symbol, listener: (...args: any[]) => void): any;
    removeAllListeners(event?: string | symbol | undefined): any;
    setMaxListeners(n: number): any;
    getMaxListeners(): number;
    listeners(event: string | symbol): Function[];
    rawListeners(event: string | symbol): Function[];
    emit(event: string | symbol, ...args: any[]): boolean;
    listenerCount(type: string | symbol): number;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): any;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): any;
    eventNames(): (string | symbol)[];
};
export default _default;
//# sourceMappingURL=userAccountGoogleService.d.ts.map