# alp-config

## With Koa

```js
import packageConfig from './package.json';
import Koa from 'koa';
import config from 'alp-config';

const app = new Koa();
config(__dirname + '/config', { packageConfig })(app);
```

## With Ibex

Config is cached in localstorage. `/config` is the path to the public config folder.

```js
import Ibex from 'ibex';
import config from 'alp-config';

const app = new Ibex();
app.appVersion = '1.0.0';
config('/config')(app);
```


## With Alp

```js
import Alp from 'alp';

const app = new Alp();
```
