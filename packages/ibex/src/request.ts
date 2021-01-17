import type { ParsedUrlQuery } from 'querystring';
import { parse as parseQueryString } from 'querystring';
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

const request: BaseRequest = {
  get search() {
    return window.location.search;
  },
  get path() {
    return window.location.pathname;
  },
  get url() {
    return window.location.pathname + window.location.search;
  },
  get origin() {
    return window.location.origin;
  },
  get protocol() {
    return window.location.protocol;
  },
  get query() {
    return window.location.search.length === 0
      ? {}
      : parseQueryString(window.location.search.slice(1));
  },
  get searchParams() {
    return new URLSearchParams(
      window.location.search.length === 0
        ? window.location.search
        : window.location.search.slice(1),
    );
  },
  get href() {
    return window.location.href;
  },
  get host() {
    return window.location.host;
  },
  get hostname() {
    return window.location.hostname;
  },
  get headers(): never {
    throw new Error('Headers not available in ibex request.');
  },
};

export default request;
