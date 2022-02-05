import type { BaseRequest as KoaBaseRequest } from 'koa';
import type Application from '.';

export interface BaseRequest {
  readonly url: string;
  readonly origin: string;
  readonly href: string;
  readonly path: string;
  readonly query: never;
  readonly querystring: string;
  readonly search: string;
  readonly host: string;
  readonly protocol: string;
  readonly hostname: string;
  readonly headers: Record<string, string>;

  accepts: KoaBaseRequest['accepts'];
  acceptsLanguages: KoaBaseRequest['acceptsLanguages'];
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
  get query(): never {
    throw new Error('Use context.searchParams instead.');
  },
  get querystring() {
    return window.location.search;
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
  get accepts(): never {
    throw new Error('Not implemented.');
  },
  get acceptsLanguages(): never {
    throw new Error('Not implemented.');
  },
};

export default request;
