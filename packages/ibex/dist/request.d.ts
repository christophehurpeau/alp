/// <reference types="node" />
import type { ParsedUrlQuery } from 'querystring';
import type Application from '.';
export interface BaseRequest {
    readonly url: string;
    readonly origin: string;
    readonly href: string;
    readonly path: string;
    readonly searchParams: URLSearchParams;
    readonly query: ParsedUrlQuery;
    readonly search: string;
    readonly host: string;
    readonly protocol: string;
    readonly hostname: string;
    readonly headers: Record<string, string>;
}
export interface Request extends BaseRequest {
    readonly app: Application;
}
declare const request: BaseRequest;
export default request;
//# sourceMappingURL=request.d.ts.map