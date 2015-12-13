# auk

Framework based on koa 2.
Auk requires node v4.0.0 or higher


```js
import Auk from 'auk';
import serve from 'koa-static';
import convert from 'koa-convert';
import config from 'auk-config';
import language from 'auk-language';
import logger from 'auk-logger';
import router from 'auk-limosa';
import routerBuilder from './routerBuilder';

import controllers from './controllers';

const app = new Auk();
config(__dirname + '/config')(app);
language(app);
logger(app);
const handler = router(routerBuilder, controllers)(app);

app.use(convert(serve(__dirname + '../public/'))); // static files
app.use(handler);

app.listen();
```
