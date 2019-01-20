import { NodeApplicationInCreation } from 'alp-types';
interface Args {
    [key: string]: any;
}
declare module 'alp-types' {
    interface Context {
        t: (id: string, args: Args) => string;
    }
}
export default function alpTranslate(dirname: string): (app: NodeApplicationInCreation) => Map<any, any>;
export {};
//# sourceMappingURL=index.d.ts.map