import 'babel-regenerator-runtime';
import Ibex from 'ibex';
import config from 'ibex-config';
import language from 'ibex-language';
import logger from 'ibex-logger';
import reactredux from 'ibex-react-redux';
import translate from 'ibex-translate';
import controllers from './controllers/index';

import helloApp from './reducers/index';
import IndexView from './views/IndexView';

(async function main() {
    const app = new Ibex();
    await config('js/config')(app);
    logger(app);
    language(app);
    await translate('locales')(app);
    await reactredux({
        View: IndexView,
        reducers: helloApp,
        initialData: window.initialData,
        element: document.getElementById('app'),
    })(app);

    await app.run();
})().catch(console.log.bind(console));
