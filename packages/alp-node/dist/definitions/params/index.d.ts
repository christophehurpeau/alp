import type { AlpNodeApp } from '../AlpNodeApp';
import { ParamValueFromContext } from './ParamValueFromContext';
export interface AlpParamsContext {
    params: ParamValueFromContext;
    validParams: ParamValueFromContext;
    namedParam: (name: string) => string | undefined;
    otherParam: (position: number) => string | undefined;
    queryParam: (name: string) => string | undefined;
    bodyParam: <T>(name: string) => T | undefined;
}
export interface AlpParamsRequest {
    searchParams: URLSearchParams;
}
export default function alpParams(app: AlpNodeApp): void;
//# sourceMappingURL=index.d.ts.map