import 'babel-regenerator-runtime';
import Ibex from 'ibex';
import config from 'ibex-config';
import language from 'ibex-language';
import logger from 'ibex-logger';
import reactredux from 'ibex-react-redux';
import translate from 'ibex-translate';
import router from 'ibex-limosa';
import routerBuilder from './routerBuilder';
import controllers from './controllers/index';

import helloApp from './reducers/index';

export default function(View) {
    return main().catch(console.log.bind(console));
}

async function main() {
    const app = new Ibex();
    await config('js/config')(app);
    logger(app);
    language(app);
    await translate('locales')(app);
    const handler = router(routerBuilder, controllers)(app);
    const context = await reactredux({
        View: View,
        reducers: helloApp,
        initialData: window.initialData,
        element: document.getElementById('app'),
    })(app);

    app.use(handler);

    await app.run();
};
