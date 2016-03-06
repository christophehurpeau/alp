import 'babel-regenerator-runtime';
import Ibex from 'ibex';
import config from 'ibex-config';
import language from 'ibex-language';
import logger from 'ibex-logger';
import reactredux from 'ibex-react-redux';
import translate from 'ibex-translate';
import './controllers/index';

import * as appDescriptor from './views/index';

(async function main() {
    const app = new Ibex();
    app.appVersion = window.VERSION;
    await config('config')(app);
    logger(app);
    language(app);
    await translate('locales')(app);
    await reactredux({
        appDescriptor,
        initialData: window.initialData,
        element: document.getElementById('app'),
    })(app);

    await app.run();
}());
