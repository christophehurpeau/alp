import { parse as parseQueryString } from 'querystring';

export default {
  get search() {
    return window.location.search;
  },
  get path() {
    return window.location.pathname;
  },
  get port() {
    return window.location.port;
  },
  get url() {
    return window.location.url;
  },
  get origin() {
    return window.location.origin;
  },
  get protocol() {
    return window.location.protocol;
  },
  get query() {
    return parseQueryString(window.location.search);
  },
  get searchParams() {
    return new URLSearchParams(
      window.location.search.length === 0
        ? window.location.search
        : window.location.search.substr(1),
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
