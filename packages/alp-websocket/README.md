# alp-websocket

Provide a simple access to socket.io

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
