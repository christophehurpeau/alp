import Koa from 'koa';
import serve from 'koa-static';
import convert from 'koa-convert';
import config from 'auk-config';
import errors from 'auk-errors';
import params from 'auk-params';
import language from 'auk-language';
import logger from 'auk-logger';
import translate from 'auk-translate';
import router from 'auk-limosa';
import _listen from 'auk-listen';

export default class Auk extends Koa {
    /**
     * @param {string} [dirname] directory of the application (lib/) or `process.cwd()`
     * @param {Object} [options] directory of the application (lib/) or `process.cwd()`
     * @param {array} [options.argv] list of overridable config by argv
     */
    constructor(dirname = process.cwd(), options = {}) {
        super();
        this.dirname = dirname;
        const packageConfig = require(`${dirname}/../package.json`);
        config(`${this.dirname}/config`, {
            packageConfig,
            argv: options.argv,
        })(this);
        params(this);
        language(this);
        logger(this);
        translate('locales')(this);
    }

    get environment() {
        return this.env;
    }

    createRouter(routerBuilder, controllers) {
        return router(routerBuilder, controllers)(this);
    }

    servePublic() {
        this.use(convert(serve(`${this.dirname}/../public/`))); // static files
    }

    catchErrors() {
        this.use(errors);
    }

    useRouter(routerBuilder, controllers) {
        routerBuilder = routerBuilder || require(`${this.dirname}/routerBuilder`);
        controllers = controllers || require(`${this.dirname}/controllers`);
        this.use(this.createRouter(routerBuilder, controllers));
    }

    listen() {
        return _listen(`${this.dirname}/../config/cert`)(this)
            .catch(err => {
                this.logger.error(err);
                throw err;
            });
    }
}
