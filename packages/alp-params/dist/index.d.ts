import type { NodeApplicationInCreation } from 'alp-types';
import 'alp-router';
import { ParamValidator } from './ParamValidator';
export { ParamValidator } from './ParamValidator';
declare module 'alp-types' {
    interface Context {
        params: ParamValidator;
        validParams: ParamValidator;
        param: (name: string) => string | undefined;
        namedParam: (name: string) => string | undefined;
        otherParam: (position: number) => string | undefined;
        paramGET: (name: string) => string | undefined;
        paramGETorPOST: <T>(name: string) => T | undefined;
    }
}
export default function alpParams(app: NodeApplicationInCreation): void;
//# sourceMappingURL=index.d.ts.map