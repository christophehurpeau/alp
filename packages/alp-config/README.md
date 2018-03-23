<h3 align="center">
  alp-config
</h3>

<p align="center">
  config in alp framework
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-config"><img src="https://img.shields.io/npm/v/alp-config.svg?style=flat-square"></a>
  <a href="https://david-dm.org/alpjs/alp-config"><img src="https://david-dm.org/alpjs/alp-config.svg?style=flat-square"></a>
  <a href="https://dependencyci.com/github/alpjs/alp-config"><img src="https://dependencyci.com/github/alpjs/alp-config/badge?style=flat-square"></a>
</p>

## In your app

```js
import packageConfig from './package.json';
import { Config } from 'alp-config';

const config = new Config(__dirname + '/config');
export default config;
config.loadSync({ packageConfig });
```

## With Koa

```js
import Koa from 'koa';
import config from './config';

const app = new Koa();
config()(app, config);
```

## With Ibex

Config is cached in localstorage. `/config` is the path to the public config folder.

```js
import Ibex from 'ibex';
import config from './config';

const app = new Ibex();
app.appVersion = '1.0.0';
config('/config')(app);
```


## With Alp

```js
import Alp from 'alp'; 
import config from './config';

const app = new Alp({ config });
```
