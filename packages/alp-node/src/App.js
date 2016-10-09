import { deprecate } from 'util';
import Koa from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';
import config from 'alp-config/src';
import errors from 'alp-errors-node';
import params from 'alp-params';
import language from 'alp-language';
import translate from 'alp-translate';
import _listen from 'alp-listen';
import migrations from 'alp-migrations';
import Logger from 'nightingale-logger';
import findUp from 'findup-sync';
import path from 'path';

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
   * @param {string} [options.dirname] directory of the application
   * @param {string} [options.certPath] directory of the ssl certificates
   * @param {string} [options.publicPath] directory of public files
   * @param {Config} [options.config] alp-config object
   * @param {Array} [options.argv] deprecated, list of overridable config by argv
   */
  constructor(options = {}) {
    super();
    if (options.packageDirname) deprecate(() => () => null, 'options.packageDirname')();
    if (options.srcDirname) {
      deprecate(() => () => null, 'options.srcDirname: use dirname instead')();
      options.dirname = options.srcDirname;
    }
    if (!options.dirname) {
      options.dirname = path.dirname(process.argv[1]);
    }

    this.dirname = path.normalize(options.dirname);

    const packagePath = findUp('package.json', { cwd: options.dirname });
    if (!packagePath) throw new Error(`Could not find package.json: "${packagePath}"`);
    const packageDirname = path.dirname(packagePath);

    Object.defineProperty(this, 'packageDirname', {
      get: deprecate(() => packageDirname, 'packageDirname'),
      configurable: false,
      enumerable: false,
    });

    this.certPath = options.certPath || `${this.packageDirname}/config/cert`;
    this.publicPath = options.publicPath || `${this.packageDirname}/public/`;

    if (!options.config) {
      // eslint-disable-next-line import/no-dynamic-require, global-require
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
