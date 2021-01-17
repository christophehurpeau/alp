import type { BrowserApplicationInCreation } from 'alp-types';
declare module 'alp-types' {
    interface BaseContext {
        firstAcceptedLanguage: string;
        language: string;
    }
    interface Context {
    }
}
export default function alpLanguage(app: BrowserApplicationInCreation): void;
//# sourceMappingURL=index.d.ts.map