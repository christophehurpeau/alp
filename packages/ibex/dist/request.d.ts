/// <reference types="node" />
import { ParsedUrlQuery } from 'querystring';
export interface Request {
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
}
declare const request: Request;
export default request;
//# sourceMappingURL=request.d.ts.map