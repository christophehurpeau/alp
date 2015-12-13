import Auk from 'auk';
import serve from 'koa-static';
import convert from 'koa-convert';
import config from 'auk-config';
import errors from 'auk-errors';
import params from 'auk-params';
import language from 'auk-language';
import logger from 'auk-logger';
import translate from 'auk-translate';
import router from 'auk-limosa';
import routerBuilder from './routerBuilder';
import turaco from 'auk-turaco';

import controllers from './controllers/index';

const app = new Auk();
config(__dirname + '/config')(app);
params(app);
language(app);
logger(app);
translate('locales')(app);
turaco(__dirname + '/views')(app);
const handler = router(routerBuilder, controllers)(app);

app.use(errors);
app.use(convert(serve(__dirname + '/../public/'))); // static files
app.use(handler);

app.listen();
