# auk-listen

Handles http and https via config

```js
import Koa from 'koa';
import config from 'auk-config';
import errors from 'auk-errors';
import logger from 'auk-logger';
import listen from 'auk-listen';

const app = new Koa();
config(`${__dirname}/config`, { packageConfig })(app);
logger(app);

app.use(errors);

listen(`${__dirname}/../cert/`)(app).then((server) => {
    console.log('Listening !');
});
```

config:
 - `socketPath` OR `port` (+ `hostname`)
 - `tls`: boolean

If `tls` is true, the files `server.key` and `server.crt`
will be loaded from the
