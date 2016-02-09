import 'babel-regenerator-runtime';
import Ibex from 'ibex';
import config from 'ibex-config';
import language from 'ibex-language';
import logger from 'ibex-logger';
import reactredux from 'ibex-react-redux';
import translate from 'ibex-translate';
import controllers from './controllers/index';
import './config/common.json!text';

import * as appDescriptor from './views/index';

export default (async function main() {
    const app = new Ibex();
    await config('js/config')(app);
    logger(app);
    language(app);
    await translate('locales')(app);
    await reactredux({
        appDescriptor,
        initialData: window.initialData,
        element: document.getElementById('app'),
    })(app);

    await app.run();
});
