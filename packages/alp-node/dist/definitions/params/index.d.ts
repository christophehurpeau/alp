import type { AlpNodeApp } from "../AlpNodeApp";
import { ParamValueFromContext } from "./ParamValueFromContext";
export interface AlpParamsContext {
    params: ParamValueFromContext;
    validParams: ParamValueFromContext;
    namedRouteParam: (name: string) => string | undefined;
    otherRouteParam: (position: number) => string | undefined;
    /** @deprecated use namedRouteParam */
    namedParam: never;
    /** @deprecated use otherRouteParam */
    otherParam: never;
    queryParam: (name: string) => string | undefined;
    bodyParam: <T>(name: string) => T | undefined;
}
export interface AlpParamsRequest {
    searchParams: URLSearchParams;
}
export default function alpParams(app: AlpNodeApp): void;
//# sourceMappingURL=index.d.ts.map