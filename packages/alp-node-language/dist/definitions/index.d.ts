import type { ApplicationInCreation } from 'alp-types';
declare module 'alp-types' {
    interface BaseContext {
    }
    interface Context {
        readonly firstAcceptedLanguage: string;
        readonly language: string;
    }
}
export default function alpLanguage(app: ApplicationInCreation): void;
//# sourceMappingURL=index.d.ts.map