<h3 align="center">
  alp-router
</h3>

<p align="center">
  router for alp
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-router"><img src="https://img.shields.io/npm/v/alp-router.svg?style=flat-square"></a>
</p>

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
import config from 'alp-node-config';
import language from 'alp-node-language';
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
