# alp-websocket [![NPM version][npm-image]][npm-url]

websocket in alp framework

[![Dependency Status][daviddm-image]][daviddm-url]
[![Dependency ci Status][dependencyci-image]][dependencyci-url]

## Server-side

```js
import Koa from 'koa';
import config from 'alp-config';
import websocket from 'alp-websocket';

const app = new Koa();
config(`${__dirname}/config`, { packageConfig })(app);
const io = websocket(app);
```


## Browser-side

```js
import Ibex from 'ibex';
import config from 'alp-config';
import websocket from 'alp-websocket';

const app = new Ibex();
config('/config')(app);
const socket = websocket(app);
```

## Config

```yaml
common:
    websocket:
        secure: true
        port: 3001
```

[npm-image]: https://img.shields.io/npm/v/alp-websocket.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alp-websocket
[daviddm-image]: https://david-dm.org/alpjs/alp-websocket.svg?style=flat-square
[daviddm-url]: https://david-dm.org/alpjs/alp-websocket
[dependencyci-image]: https://dependencyci.com/github/alpjs/alp-websocket/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/alpjs/alp-websocket
