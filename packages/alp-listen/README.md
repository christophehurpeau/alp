<h3 align="center">
  alp-listen
</h3>

<p align="center">
  Listen function, using config and logger for alp server
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-listen"><img src="https://img.shields.io/npm/v/alp-listen.svg?style=flat-square"></a>
</p>

## Install

```sh
npm install --save alp-listen
```

## Usage

```js
import Koa from 'koa';
import config from 'alp-node-config';
import errors from 'alp-errors';
import logger from 'alp-logger';
import listen from 'alp-listen';

const app = new Koa();
config(new URL('./config', import.meta.url), { packageConfig })(app);
logger(app);

app.use(errors);

listen(new URL('../cert', import.meta.url))(app).then((server) => {
  console.log('Listening !');
});
```

config:

- `socketPath` OR `port` (+ `hostname`)
- `tls`: boolean

If `tls` is true, the files `server.key` and `server.crt`
will be loaded from the path given in the first param
