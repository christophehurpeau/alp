import Koa from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';
import config from 'alp-config';
import errors from 'alp-errors-node';
import params from 'alp-params-node';
import language from 'alp-language';
import translate from 'alp-translate';
import router from 'alp-limosa';
import _listen from 'alp-listen';
import Logger from 'nightingale-logger';

export { default as newController } from 'alp-controller';

const logger = new Logger('alp');

export default class Alp extends Koa {
    /**
     * @param {string} [packageDirname] directory of the package (where package.json is)
     * @param {string} [srcDirname] directory of the application
     * @param {Object} [options]
     * @param {array} [options.argv] list of overridable config by argv
     */
    constructor(packageDirname = process.cwd(), srcDirname = `${packageDirname}/lib`, options = {}) {
        super();
        this.packageDirname = packageDirname;
        this.dirname = srcDirname;
        const packageConfig = require(`${packageDirname}/package.json`);
        config(`${this.dirname}/config`, {
            packageConfig,
            argv: options.argv,
        })(this);
        params(this);
        language(this);
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
        this.use(serve(`${this.packageDirname}/public/`)); // static files
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
        return _listen(`${this.packageDirname}/config/cert`)(this)
            .catch(err => {
                logger.error(err);
                throw err;
            });
    }
}
