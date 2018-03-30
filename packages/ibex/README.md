<h3 align="center">
  ibex
</h3>

<p align="center">
  Framework for browser, with the same API than koa 2
</p>

<p align="center">
  <a href="https://npmjs.org/package/ibex"><img src="https://img.shields.io/npm/v/ibex.svg?style=flat-square"></a>
  <a href="https://david-dm.org/alpjs/ibex"><img src="https://david-dm.org/alpjs/ibex.svg?style=flat-square"></a>
  <a href="https://dependencyci.com/github/alpjs/ibex"><img src="https://dependencyci.com/github/alpjs/ibex/badge?style=flat-square"></a>
</p>

## Usage

```js
import Ibex from 'ibex';

const app = new Ibex();

app.use(...);
```

## API
 
### context

- context.app Application instance reference.
- context.host (see context.request)
- context.hostname (see context.request)
- context.href (see context.request)
- context.origin (see context.request)
- context.path (see context.request)
- context.protocol (see context.request)
- context.query (see context.request)
- context.url (see context.request)
- context.search (see context.request)
- context.searchParams (see context.request)

### context.request

- request.hash [location.hash](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash)
- request.host [location.host](https://developer.mozilla.org/en-US/docs/Web/API/Location/host)
- request.hostname [location.hostname](https://developer.mozilla.org/en-US/docs/Web/API/Location/hostname)
- request.href [location.href](https://developer.mozilla.org/en-US/docs/Web/API/Location/href)
- request.origin [location.origin](https://developer.mozilla.org/en-US/docs/Web/API/Location/origin)
- request.path [location.path](https://developer.mozilla.org/en-US/docs/Web/API/Location/path)
- request.query Query is parsed using [`query-string`](https://www.npmjs.com/package/query-string). Prefer `request.searchParams` if possible.
- request.url [location.url](https://developer.mozilla.org/en-US/docs/Web/API/Location/url)
- request.port [location.port](https://developer.mozilla.org/en-US/docs/Web/API/Location/port)
- request.protocol [location.protocol](https://developer.mozilla.org/en-US/docs/Web/API/Location/protocol)
- request.search [location.search](https://developer.mozilla.org/en-US/docs/Web/API/Location/search)
- request.searchParams [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
