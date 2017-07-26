# alp-router [![NPM version][npm-image]][npm-url]

router for alp

[![Dependency ci Status][dependencyci-image]][dependencyci-url]
[![Dependency Status][daviddm-image]][daviddm-url]

## router-segments

This package works with [router-segments](https://www.npmjs.com/package/router-segments).

## Install

```
yarn add alp-router router-segments
npm install --save alp-router router-segments
```

## With Koa

```js
import Koa from 'koa';
import config from 'alp-config';
import language from 'alp-language';
import router from 'alp-router';
import createRouter from './createRouter';

const app = new Koa();
// init
config(__dirname + '/config')(app);
language(app);

// handlers
app.use(router(createRouter())(app));
```

## With Alp (Node or Browser)

```js
import Alp from 'alp';         
import router from 'alp-router';
import createRouter from './createRouter';

const app = new Alp();

// handlers
app.use(router(createRouter())(app));
```

[npm-image]: https://img.shields.io/npm/v/alp-router.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alp-router
[daviddm-image]: https://david-dm.org/alpjs/alp-router.svg?style=flat-square
[daviddm-url]: https://david-dm.org/alpjs/alp-router
[dependencyci-image]: https://dependencyci.com/github/alpjs/alp-router/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/alpjs/alp-router
