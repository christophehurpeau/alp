import Auk from 'auk';
import serve from 'koa-static';
import convert from 'koa-convert';
import config from 'auk-config';
import params from 'auk-params';
import language from 'auk-language';
import logger from 'auk-logger';
import errors from 'auk-errors';
import translate from 'auk-translate';
import router from 'auk-limosa';
import routerBuilder from './routerBuilder';
import reactredux from 'auk-react-redux';
import Html from './views/layouts/Html';

import controllers from './controllers';

const app = new Auk();
config(__dirname + '/config')(app);
params(app);
language(app);
logger(app);
translate('locales')(app);
reactredux(Html)(app);
const handler = router(routerBuilder, controllers)(app);

app.use(convert(serve(__dirname + '/../public/'))); // static files
app.use(errors);
app.use(handler);

app.listen();
