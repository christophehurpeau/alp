# alp-errors-node

```js
import Koa from 'koa';
import config from 'alp-config';
import logger from 'alp-logger';
import errors from 'alp-errors-node';

const app = new Koa();
config(__dirname + '/config')(app);
logger(app);

app.use(errors);
```
