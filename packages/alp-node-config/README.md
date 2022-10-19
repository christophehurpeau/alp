<h3 align="center">
  alp-node-config
</h3>

<p align="center">
  config in alp framework
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-node-config"><img src="https://img.shields.io/npm/v/alp-node-config.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/alp-node-config"><img src="https://img.shields.io/npm/dw/alp-node-config.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/alp-node-config"><img src="https://img.shields.io/node/v/alp-node-config.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/alp-node-config"><img src="https://img.shields.io/npm/types/alp-node-config.svg?style=flat-square"></a>
</p>

## In your app

```js
import packageConfig from './package.json';
import { Config } from 'alp-node-config';

const config = new Config(new URL('./config', import.meta.url));
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

## With Alp

```js
import Alp from 'alp';
import config from './config';

const app = new Alp({ config });
```
