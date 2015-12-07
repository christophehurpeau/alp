import Auk from 'auk';
import serve from 'koa-static';
import convert from 'koa-convert';
import config from 'auk-config';
import params from 'auk-params';
import language from 'auk-language';
import logger from 'auk-logger';
import translate from 'auk-translate';
import router from 'auk-limosa';
import routerBuilder from './routerBuilder';
import react from 'auk-react';

import controllers from './controllers';

const app = new Auk();
app.init(config(__dirname + '/config'));
app.init(params);
app.init(language);
app.init(logger);
app.init(translate('locales'));
app.init(react);
const handler = app.init(router(routerBuilder, controllers));

app.use(convert(serve(__dirname + '../public/'))); // static files
app.use(handler);

app.listen();
