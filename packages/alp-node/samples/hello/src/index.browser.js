import 'babel-regenerator-runtime';
import Ibex from 'ibex';
import config from 'ibex-config';
import logger from 'ibex-logger';
import turaco from 'ibex-turaco';
import controllers from './controllers/index';

(async function main() {
    const app = new Ibex();
    await config('js/config')(app);
    logger(app);
    turaco('js/views/')(app);
    app.run();
})();
