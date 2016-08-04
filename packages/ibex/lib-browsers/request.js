'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* global location, URLSearchParams */

var qs = require('query-string');

exports.default = {
    get search() {
        return location.search;
    },
    get path() {
        return location.pathname;
    },
    get port() {
        return location.port;
    },
    get url() {
        return location.url;
    },
    get origin() {
        return location.origin;
    },
    get protocol() {
        return location.protocol;
    },
    get query() {
        return qs.parse(location.search);
    },
    get searchParams() {
        return new URLSearchParams(!location.search.length ? location.search : location.search.substr(1));
    },
    get href() {
        return location.href;
    },
    get host() {
        return location.host;
    },
    get hostname() {
        return location.hostname;
    }
};
//# sourceMappingURL=request.js.map