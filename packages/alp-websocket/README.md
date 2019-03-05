<h3 align="center">
  alp-websocket
</h3>

<p align="center">
  websocket in alp framework
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-websocket"><img src="https://img.shields.io/npm/v/alp-websocket.svg?style=flat-square"></a>
  <a href="https://david-dm.org/christophehurpeau/alp?path=packages/alp-websocket"><img src="https://david-dm.org/christophehurpeau/alp.svg?path=packages/alp-websocket?style=flat-square"></a>
</p>

## Server-side

```js
import Koa from 'koa';
import config from 'alp-node-config';
import websocket from 'alp-websocket';

const app = new Koa();
config(`${__dirname}/config`, { packageConfig })(app);
const io = websocket(app);
```


## Browser-side

```js
import Ibex from 'ibex';
import config from 'alp-browser-config';
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
