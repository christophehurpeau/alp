# alp-listen [![NPM version][npm-image]][npm-url]

Listen function, using config and logger for alp server

[![Dependency ci Status][dependencyci-image]][dependencyci-url]
[![Dependency Status][daviddm-image]][daviddm-url]

## Install

```sh
npm install --save alp-listen
```

## Usage

```js
import Koa from 'koa';
import config from 'alp-config';
import errors from 'alp-errors';
import logger from 'alp-logger';
import listen from 'alp-listen';

const app = new Koa();
config(`${__dirname}/config`, { packageConfig })(app);
logger(app);

app.use(errors);

listen(`${__dirname}/../cert/`)(app).then((server) => {
    console.log('Listening !');
});
```

config:
 - `socketPath` OR `port` (+ `hostname`)
 - `tls`: boolean

If `tls` is true, the files `server.key` and `server.crt`
will be loaded from the path given in the first param

[npm-image]: https://img.shields.io/npm/v/alp-listen.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alp-listen
[daviddm-image]: https://david-dm.org/alpjs/alp-listen.svg?style=flat-square
[daviddm-url]: https://david-dm.org/alpjs/alp-listen
[dependencyci-image]: https://dependencyci.com/github/alpjs/alp-listen/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/alpjs/alp-listen
