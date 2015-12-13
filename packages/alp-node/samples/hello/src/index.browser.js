import 'babel-regenerator-runtime';
import Ibex from 'ibex';
import config from 'ibex-config';
import language from 'ibex-language';
import logger from 'ibex-logger';
import turaco from 'ibex-turaco';
import translate from 'ibex-translate';
import controllers from './controllers/index';

(async function main() {
    const app = new Ibex();
    await config('js/config')(app);
    logger(app);
    language(app);
    await translate('locales')(app);
    await turaco('js/views/')(app);

    await app.run();
})().catch(console.log.bind(console));
