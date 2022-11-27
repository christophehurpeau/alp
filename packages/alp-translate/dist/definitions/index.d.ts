import type { NodeApplicationInCreation } from 'alp-types';
type Args = Record<string, any>;
declare module 'alp-types' {
    interface BaseContext {
        t: (id: string, args: Args) => string;
    }
    interface Context {
        readonly language: string;
    }
}
export default function alpTranslate(dirname: string): (app: NodeApplicationInCreation) => void;
export {};
//# sourceMappingURL=index.d.ts.map