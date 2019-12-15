import { NodeApplicationInCreation } from 'alp-types';
import ParamValidator from './ParamValidator';
export { ParamValidator };
declare module 'alp-types' {
    interface Context {
        param(name: string): string | undefined;
        namedParam(name: string): string | undefined;
        otherParam(position: number): string | undefined;
        paramGET(name: string): string | undefined;
        paramGETorPOST(name: string): any | undefined;
    }
}
export default function alpParams(app: NodeApplicationInCreation): void;
//# sourceMappingURL=index.d.ts.map