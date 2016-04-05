import Koa from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';
import config from 'alp-config';
import errors from 'alp-errors-node';
import params from 'alp-params-node';
import language from 'alp-language';
import logger from 'alp-logger';
import translate from 'alp-translate';
import router from 'alp-limosa';
import _listen from 'alp-listen';

export default class Alp extends Koa {
    /**
     * @param {string} [dirname] directory of the application (lib/) or `process.cwd() + '/lib'`
     * @param {Object} [options]
     * @param {array} [options.argv] list of overridable config by argv
     */
    constructor(dirname = `${process.cwd()}/lib`, options = {}) {
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
        this.use(compress());
    }

    get environment() {
        return this.env;
    }

    get production() {
        return this.env === 'prod' || this.env === 'production';
    }

    createRouter(routerBuilder, controllers) {
        return router(routerBuilder, controllers)(this);
    }

    servePublic() {
        this.use(serve(`${this.dirname}/../public/`)); // static files
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
