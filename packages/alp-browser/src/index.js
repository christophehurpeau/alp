import Ibex from 'ibex';
import config from 'alp-config';
// import errors from 'alp-errors-browser';
// import params from 'alp-params-browser';
import language from 'alp-language';
import translate from 'alp-translate';
import router from 'alp-limosa';

export default class AlpBrowser extends Ibex {
    path: string;
    appVersion: string;

    /**
     * @param {string} [path='/']
     * @param {Object} [options]
     */
    constructor(path = '/', options = {}) {
        super();
        this.path = path;
    }

    async init() {
        await config('config')(this);
        language(this);
        await translate('locales')(this);
    }

    get environment() {
        return this.env;
    }

    createRouter(routerBuilder, controllers) {
        return router(routerBuilder, controllers)(this);
    }

    catchErrors() {
        // this.use(errors);
    }

    useRouter(routerBuilder, controllers) {
        this.use(this.createRouter(routerBuilder, controllers));
    }
}
