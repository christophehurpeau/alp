import { deprecate } from 'util';
import Koa from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';
import config from 'alp-config';
import errors from 'alp-errors-node';
import params from 'alp-params';
import language from 'alp-language';
import translate from 'alp-translate';
import _listen from 'alp-listen';
import migrations from 'alp-migrations';
import Logger from 'nightingale-logger';

export { Config } from 'alp-config';
export { default as newController } from 'alp-controller';
export { MigrationsManager } from 'alp-migrations';

const logger = new Logger('alp');

export default class Alp extends Koa {
  dirname: string;
  packageDirname: string;
  browserStateTransformers: Array<Function>;
  config;

  /**
   * @param {Object} [options]
   * @param {string} [options.srcDirname] directory of the application
   * @param {Config} [options.config] alp-config object
   * @param {string} [options.packageDirname] deprecated, directory of the package
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
    this.browserContextTransformers = [
      (initialBrowserContext, context) => {
        initialBrowserContext.state = Object.create(null);
        this.browserStateTransformers.forEach(transformer => (
          transformer(initialBrowserContext.state, context)
        ));
      },
    ];

    this.context.computeInitialContextForBrowser = function () {
      const initialBrowserContext = Object.create(null);

      this.app.browserContextTransformers.forEach(transformer => (
        transformer(initialBrowserContext, this)
      ));

      return initialBrowserContext;
    };
  }

  registerBrowserContextTransformer(transformer: Function) {
    this.browserContextTransformers.push(transformer);
  }

  registerBrowserStateTransformer(transformer: Function) {
    this.browserStateTransformers.push(transformer);
  }

  registerBrowserStateTransformers(transformer) {
    deprecate(() => () => null, 'breaking: use registerBrowserStateTransformer instead')();
    this.browserStateTransformers.push(transformer);
  }

  migrate(migrationsManager) {
    return migrations({
      config: this.config,
      dirname: `${this.dirname}/migrations`,
      migrationsManager,
    });
  }

  get environment() {
    deprecate(() => () => null, 'app.environment, use app.env instead')();
    return this.env;
  }

  get production() {
    deprecate(() => () => null, 'app.production, use global.PRODUCTION instead')();
    return this.env === 'prod' || this.env === 'production';
  }
  servePublic() {
    this.use(serve(`${this.packageDirname}/public/`)); // static files
  }

  catchErrors() {
    this.use(errors);
  }

  listen() {
    return _listen(`${this.packageDirname}/config/cert`)(this)
      .then(server => this._server = server)
      .catch(err => {
        logger.error(err);
        throw err;
      });
  }

  /**
   * Close server and emit close event
   */
  close() {
    if (this._server) {
      this._server.close();
      this.emit('close');
    }
  }
}
