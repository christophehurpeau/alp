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
    const context = await reactredux({
        View: IndexView,
        reducers: helloApp,
        initialData: window.initialData,
        element: document.getElementById('app'),
    })(app);

    context.store.subscribe(() => {
        const state = context.store.getState();

        const queryParams = new URLSearchParams(!location.search.length ? location.search : location.search.substr(1));
        if (!state.name) {
            queryParams.delete('name');
        } else {
            queryParams.set('name', state.name);
        }

        const queryString = queryParams.toString();
        if (queryString !== location.query) {
            history.replaceState(
                { name: state.name },
                document.title,
                location.pathname.slice(0, -(location.search.length - 1))
                    + (queryString && '?' + queryString)
            );
        }
    });

    await app.run();
})().catch(console.log.bind(console));
