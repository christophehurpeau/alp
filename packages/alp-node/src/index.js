import { deprecate } from 'util';
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

export { Config } from 'alp-config';
export { default as newController } from 'alp-controller';

const logger = new Logger('alp');

export default class Alp extends Koa {
    dirname: string;
    packageDirname: string;
    browserStateTransformers: Array<Function>;

    /**
     * @param {Object} [options]
     * @param {string} [options.srcDirname] directory of the application
     * @param {Config} [options.config] alp-config object
     * @param {string} [options.packageDirname] deprecated, directory of the package (where package.json is)
     * @param {Array} [options.argv] deprecated, list of overridable config by argv
     */
    constructor(options = {}) {
        super();
        if (!options.packageDirname) options.packageDirname = process.cwd();
        if (!options.srcDirname) options.srcDirname = `${options.packageDirname}/lib`;

        this.dirname = options.srcDirname;
        Object.defineProperty(this, 'packageDirname', {
            get: deprecate(() => options.packageDirname, 'packageDirname'),
            configurable: false,
            enumerable: false,
        });


        if (!options.config) {
            deprecate(() => () => null, 'Alp options: missing options.config')();
            // eslint-disable-next-line
            const packageConfig = require(`${options.packageDirname}/package.json`);
            config(`${this.dirname}/config`, { packageConfig, argv: options.argv })(this);
        } else {
            config()(this, options.config);
        }

        params(this);
        language(this);
        translate('locales')(this);
        this.use(compress());

        this.browserStateTransformers = [];
        this.context.computeInitialStateForBrowser = function () {
            const initialBrowserState = Object.create(null);
            this.app.browserStateTransformers.forEach(transformer => transformer(initialBrowserState, this));
            return initialBrowserState;
        };
    }

    registerBrowserStateTransformers(transformer) {
        this.browserStateTransformers.push(transformer);
    }

    get environment() {
        deprecate(() => () => null, 'app.environment, use app.env instead')();
        return this.env;
    }

    get production() {
        deprecate(() => () => null, 'app.production, use global.PRODUCTION instead')();
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
        // eslint-disable-next-line global-require
        routerBuilder = routerBuilder || require(`${this.dirname}/routerBuilder`);
        // eslint-disable-next-line global-require
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
