<h3 align="center">
  alp-node-config
</h3>

<p align="center">
  config in alp framework
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-node-config"><img src="https://img.shields.io/npm/v/alp-node-config.svg?style=flat-square"></a>
  <a href="https://david-dm.org/christophehurpeau/alp?path=packages/alp-node-config"><img src="https://david-dm.org/christophehurpeau/alp?path=packages/alp-node-config.svg?style=flat-square"></a>
</p>

## In your app

```js
import packageConfig from './package.json';
import { Config } from 'alp-browser-config';

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
