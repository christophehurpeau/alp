# alp-listen

Handles http and https via config

```js
import Koa from 'koa';
import config from 'alp-config';
import errors from 'alp-errors';
import logger from 'alp-logger';
import listen from 'alp-listen';

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
will be loaded from the path given in the first param
