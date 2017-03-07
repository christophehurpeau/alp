# alp-errors-node [![NPM version][npm-image]][npm-url]

display errors in alp framework

[![Dependency ci Status][dependencyci-image]][dependencyci-url]
[![Dependency Status][daviddm-image]][daviddm-url]

## Install

```bash
npm install --save alp-errors-node
```

## Usage

```js
import Koa from 'koa';
import config from 'alp-config';
import errors from 'alp-errors-node';

const app = new Koa();
config(__dirname + '/config')(app);
logger(app);

app.use(errors);
```

[npm-image]: https://img.shields.io/npm/v/alp-errors-node.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alp-errors-node
[daviddm-image]: https://david-dm.org/alpjs/alp-errors-node.svg?style=flat-square
[daviddm-url]: https://david-dm.org/alpjs/alp-errors-node
[dependencyci-image]: https://dependencyci.com/github/alpjs/alp-errors-node/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/alpjs/alp-errors-node
