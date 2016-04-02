# alp-websocket


## Server-side :

```js
import Koa from 'koa';
import websocket from 'alp-websocket';

const app = new Koa();
const io = websocket(app);
```


## Browser-side :

```js
import Ibex from 'ibex';
import websocket from 'alp-websocket';

const app = new Ibex();
const socket = websocket(app);
```
