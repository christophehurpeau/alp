# auk-errors

```js
import Koa from 'koa';
import config from 'auk-config';
import logger from 'auk-logger';
import errors from 'auk-errors';

const app = new Koa();
config(__dirname + '/config')(app);
logger(app);

app.use(errors);
```
