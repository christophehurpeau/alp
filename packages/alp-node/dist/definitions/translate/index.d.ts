import type { AlpNodeApp } from '../AlpNodeApp';
type Args = Record<string, any>;
export interface TranslateBaseContext {
    t: (id: string, args: Args) => string;
}
export interface TranslateContext {
    readonly language: string;
}
export default function alpTranslate(dirname: string): (app: AlpNodeApp) => void;
export {};
//# sourceMappingURL=index.d.ts.map