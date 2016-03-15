import 'babel-regenerator-runtime';
import Alp from 'alp';
import reactredux from 'alp-react-redux';
import './controllers/index';

import * as moduleDescriptor from './views/index';

(async function main() {
    const app = new Alp();
    app.appVersion = window.VERSION;
    await app.init();
    await reactredux({
        moduleDescriptor,
        initialData: window.initialData,
        element: document.getElementById('app'),
    })(app);

    await app.run();
}());
