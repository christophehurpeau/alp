import { existsSync } from 'fs';
import path from 'path';
import { deprecate } from 'util';
import Koa from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';
import _config, { Config } from 'alp-config';
export { Config } from 'alp-config';
import errors from 'alp-errors-node';
import params from 'alp-params';
import language from 'alp-language';
import translate from 'alp-translate';
import _listen from 'alp-listen';
import Logger from 'nightingale-logger';
import findUp from 'findup-sync';

const logger = new Logger('alp');

const appDirname = path.dirname(process.argv[1]);

const packagePath = findUp('package.json', { cwd: appDirname });
if (!packagePath) throw new Error(`Could not find package.json: "${packagePath}"`);
const packageDirname = path.dirname(packagePath);

logger.debug('init', { appDirname, packageDirname });

// eslint-disable-next-line import/no-dynamic-require, global-require
const packageConfig = require(packagePath);

const buildedConfigPath = `${appDirname}/build/config/`;
const configPath = existsSync(buildedConfigPath) ? buildedConfigPath : `${appDirname}/config/`;
const config = new Config(configPath);
config.loadSync({ packageConfig });

let Alp = class extends Koa {

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
      enumerable: false
    });

    this.certPath = options.certPath || `${packageDirname}/config/cert`;
    this.publicPath = options.publicPath || `${packageDirname}/public/`;

    _config()(this, config);

    params(this);
    language(this);
    translate('locales')(this);

    this.use(compress());
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
    return _listen(this.certPath)(this).then(server => this._server = server).catch(err => {
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

  start(fn) {
    fn().then(() => logger.success('started')).catch(err => logger.error('start fail', { err }));
  }
};

export default Alp;
export { appDirname, packageDirname, packageConfig, config };
//# sourceMappingURL=index-node8.es.js.map
