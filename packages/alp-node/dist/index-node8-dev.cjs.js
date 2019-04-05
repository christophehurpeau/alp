'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const fs = require('fs');
const path = _interopDefault(require('path'));
const util = require('util');
const Koa = require('koa');
const Koa__default = _interopDefault(Koa);
const compress = _interopDefault(require('koa-compress'));
const serve = _interopDefault(require('koa-static'));
const _config = require('alp-node-config');
const _config__default = _interopDefault(_config);
const errors = _interopDefault(require('alp-node-errors'));
const params = _interopDefault(require('alp-params'));
const language = _interopDefault(require('alp-node-language'));
const translate = _interopDefault(require('alp-translate'));
const _listen = _interopDefault(require('alp-listen'));
const Logger = _interopDefault(require('nightingale-logger'));
const findUp = _interopDefault(require('findup-sync'));

const logger = new Logger('alp'); // see alp-dev

const appDirname = path.resolve('build');
const packagePath = findUp('package.json', {
  cwd: appDirname
});

if (!packagePath) {
  throw new Error(`Could not find package.json: "${packagePath}"`);
}

const packageDirname = path.dirname(packagePath);
logger.debug('init', {
  appDirname,
  packageDirname
}); // eslint-disable-next-line import/no-dynamic-require, global-require

const packageConfig = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
const buildedConfigPath = `${appDirname}/build/config/`;
const configPath = fs.existsSync(buildedConfigPath) ? buildedConfigPath : `${appDirname}/config/`;
const config = new _config.Config(configPath).loadSync({
  packageConfig
});
class Alp extends Koa__default {
  /**
   * @param {Object} [options]
   * @param {string} [options.certPath] directory of the ssl certificates
   * @param {string} [options.publicPath] directory of public files
   */
  constructor(options = {}) {
    super();
    this.dirname = path.normalize(appDirname);
    Object.defineProperty(this, 'packageDirname', {
      get: util.deprecate(() => packageDirname, 'packageDirname'),
      configurable: false,
      enumerable: false
    });
    this.certPath = options.certPath || `${packageDirname}/config/cert`;
    this.publicPath = options.publicPath || `${packageDirname}/public/`;
    this.config = _config__default(this, config);
    this.context.config = this.config;
    params(this);
    language(this);
    translate('locales')(this);
    this.use(compress());
  }

  existsConfigSync(name) {
    return config.existsConfigSync(name);
  }

  loadConfigSync(name) {
    return config.loadConfigSync(name);
  }

  get environment() {
    util.deprecate(() => () => null, 'app.environment, use app.env instead')();
    return this.env;
  }

  get production() {
    util.deprecate(() => () => null, 'app.production, use global.PRODUCTION instead')();
    return this.env === 'prod' || this.env === 'production';
  }

  createContext(req, res) {
    const ctx = super.createContext(req, res);
    ctx.sanitizedState = {};
    return ctx;
  }

  servePublic() {
    this.use(serve(this.publicPath)); // static files
  }

  catchErrors() {
    this.use(errors);
  }

  listen() {
    throw new Error('Use start instead');
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

  async start(fn) {
    await fn();

    try {
      const server = await _listen(this.config, this.callback(), this.certPath);
      this._server = server;
      logger.success('started');
      if (process.send) process.send('ready');
      return server;
    } catch (err) {
      logger.error('start fail', {
        err
      });
      throw err;
    }
  }

}

Object.defineProperty(exports, 'Config', {
  enumerable: true,
  get: function () {
    return _config.Config;
  }
});
exports.appDirname = appDirname;
exports.config = config;
exports.default = Alp;
exports.packageConfig = packageConfig;
exports.packageDirname = packageDirname;
//# sourceMappingURL=index-node8-dev.cjs.js.map
