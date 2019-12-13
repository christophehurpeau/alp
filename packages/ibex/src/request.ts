import { parse as parseQueryString, ParsedUrlQuery } from 'querystring';

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

const request: Request = {
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
};

export default request;
