import { deprecate } from 'util';
import Koa from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';
import _config, { Config } from 'alp-config/src';
import errors from 'alp-errors-node/src';
import params from 'alp-params/src';
import language from 'alp-language/src';
import translate from 'alp-translate';
import _listen from 'alp-listen/src';
import migrations from 'alp-migrations/src';
import Logger from 'nightingale-logger/src';
import findUp from 'findup-sync';
import path from 'path';

export { Config } from 'alp-config';
export newController from 'alp-controller';
export { MigrationsManager } from 'alp-migrations';

const logger = new Logger('alp');

export const appDirname = path.dirname(process.argv[1]);

const packagePath = findUp('package.json', { cwd: appDirname });
if (!packagePath) throw new Error(`Could not find package.json: "${packagePath}"`);
export const packageDirname = path.dirname(packagePath);

logger.debug('init', { appDirname, packageDirname });

// eslint-disable-next-line import/no-dynamic-require, global-require
export const packageConfig = require(packagePath);
export const config = new Config(`${appDirname}/config/`);
config.loadSync({ packageConfig });

export default class Alp extends Koa {
  dirname: string;
  packageDirname: string;
  browserStateTransformers: Array<Function>;
  config;

  /**
   * @param {Object} [options]
   * @param {string} [options.dirname] directory of the application
   * @param {string} [options.certPath] directory of the ssl certificates
   * @param {string} [options.publicPath] directory of public files
   * @param {Config} [options.config] alp-config object
   * @param {Array} [options.argv] deprecated, list of overridable config by argv
   */
  constructor(options = {}) {
    super();
    if (options.packageDirname) {
      throw new Error('options.packageDirname is deprecated');
    }
    if (options.config) {
      throw new Error('options.config is deprecated');
    }
    if (options.srcDirname) {
      throw new Error('options.srcDirname is deprecated');
    }
    if (options.dirname) {
      throw new Error('options.dirname is deprecated');
    }

    this.dirname = path.normalize(appDirname);

    Object.defineProperty(this, 'packageDirname', {
      get: deprecate(() => packageDirname, 'packageDirname'),
      configurable: false,
      enumerable: false,
    });

    this.certPath = options.certPath || `${this.packageDirname}/config/cert`;
    this.publicPath = options.publicPath || `${this.packageDirname}/public/`;

    _config()(this, config);

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
    this.use(serve(this.publicPath)); // static files
  }

  catchErrors() {
    this.use(errors);
  }

  listen() {
    return _listen(this.certPath)(this)
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

  start(fn: Function) {
    fn()
      .then(() => logger.success('started'))
      .catch(err => logger.error('start fail', { err }));
  }
}
