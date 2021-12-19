import type { BrowserApplicationInCreation } from 'alp-types';
declare type Args = Record<string, any>;
declare module 'alp-types' {
    interface BaseContext {
        language: string;
        t: (id: string, args: Args) => string;
    }
    interface Context {
    }
}
export default function alpTranslate(dirname: string): (app: BrowserApplicationInCreation) => Promise<void>;
export {};
//# sourceMappingURL=browser.d.ts.map