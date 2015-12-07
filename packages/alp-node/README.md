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
app.init(config(__dirname + '/config'));
app.init(language);
app.init(logger);
const handler = app.init(router(routerBuilder, controllers));

app.use(convert(serve(__dirname + '../public/'))); // static files
app.use(handler);

app.listen();
```
