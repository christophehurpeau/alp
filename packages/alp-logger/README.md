# alp-logger

## With Koa (Node)

```js
import Koa from 'koa';
import config from 'alp-config';
import logger from 'alp-logger';

const app = new Koa();
config(__dirname + '/config')(app);
logger(app);
```

## With Ibex (Browser)

```js
import Ibex from 'ibex';
import config from 'alp-config';
import logger from 'alp-logger';

const app = new Ibex();
config('config')(app);
logger(app);
```

## With Alp (Node)

```js
import Alp from 'alp';

const app = new Alp();
```

## With Alp (Browser)

```js
import Alp from 'alp';

const app = new Alp();
```
