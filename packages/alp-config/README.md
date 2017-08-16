# alp-config [![NPM version][npm-image]][npm-url]

config in alp framework

[![Dependency Status][daviddm-image]][daviddm-url]
[![Dependency ci Status][dependencyci-image]][dependencyci-url]

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

[npm-image]: https://img.shields.io/npm/v/alp-config.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alp-config
[daviddm-image]: https://david-dm.org/alpjs/alp-config.svg?style=flat-square
[daviddm-url]: https://david-dm.org/alpjs/alp-config
[dependencyci-image]: https://dependencyci.com/github/alpjs/alp-config/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/alpjs/alp-config
