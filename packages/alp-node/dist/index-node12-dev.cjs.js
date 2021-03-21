'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const fs = require('fs');
const path = require('path');
const _config = require('alp-node-config');
const findUp = require('findup-sync');
const Logger = require('nightingale-logger');
const util = require('util');
const _listen = require('alp-listen');
const errors = require('alp-node-errors');
const language = require('alp-node-language');
const params = require('alp-params');
const translate = require('alp-translate');
const Koa = require('koa');
const compress = require('koa-compress');
const serve = require('koa-static');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const path__default = /*#__PURE__*/_interopDefaultLegacy(path);
const _config__default = /*#__PURE__*/_interopDefaultLegacy(_config);
const findUp__default = /*#__PURE__*/_interopDefaultLegacy(findUp);
const Logger__default = /*#__PURE__*/_interopDefaultLegacy(Logger);
const _listen__default = /*#__PURE__*/_interopDefaultLegacy(_listen);
const errors__default = /*#__PURE__*/_interopDefaultLegacy(errors);
const language__default = /*#__PURE__*/_interopDefaultLegacy(language);
const params__default = /*#__PURE__*/_interopDefaultLegacy(params);
const translate__default = /*#__PURE__*/_interopDefaultLegacy(translate);
const Koa__default = /*#__PURE__*/_interopDefaultLegacy(Koa);
const compress__default = /*#__PURE__*/_interopDefaultLegacy(compress);
const serve__default = /*#__PURE__*/_interopDefaultLegacy(serve);

const logger$1 = new Logger__default('alp');
class AlpNodeApp extends Koa__default {
  /**
   * @param {Object} [options]
   * @param {string} [options.certPath] directory of the ssl certificates
   * @param {string} [options.publicPath] directory of public files
   */
  constructor({
    appDirname,
    packageDirname,
    config,
    certPath,
    publicPath
  }) {
    super();
    this.dirname = path__default.normalize(appDirname);
    Object.defineProperty(this, 'packageDirname', {
      get: util.deprecate(() => packageDirname, 'packageDirname'),
      configurable: false,
      enumerable: false
    });
    this.certPath = certPath || `${packageDirname}/config/cert`;
    this.publicPath = publicPath || `${packageDirname}/public/`;
    this.config = _config__default(this, config);
    this.context.config = this.config;
    params__default(this);
    language__default(this);
    translate__default('locales')(this);
    this.use(compress__default());
  }

  existsConfigSync(name) {
    return this.config.existsConfigSync(name);
  }

  loadConfigSync(name) {
    return this.config.loadConfigSync(name);
  }

  createContext(req, res) {
    const ctx = super.createContext(req, res);
    ctx.sanitizedState = {};
    return ctx;
  }

  servePublic() {
    this.use(serve__default(this.publicPath)); // static files
  }

  catchErrors() {
    this.use(errors__default);
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
      const server = await _listen__default(this.config, this.callback(), this.certPath);
      this._server = server;
      logger$1.success('started');
      if (process.send) process.send('ready');
      return server;
    } catch (err) {
      logger$1.error('start fail', {
        err
      });
      throw err;
    }
  }

}

const logger = new Logger__default('alp'); // see alp-dev

const appDirname = path__default.resolve('build');
const packagePath = findUp__default('package.json', {
  cwd: appDirname
});

if (!packagePath) {
  throw new Error(`Could not find package.json: "${String(packagePath)}"`);
}

const packageDirname = path__default.dirname(packagePath);
logger.debug('init', {
  appDirname,
  packageDirname
});
const packageConfig = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
const buildedConfigPath = `${appDirname}/build/config/`;
const configPath = fs.existsSync(buildedConfigPath) ? buildedConfigPath : `${appDirname}/config/`;
const config = new _config.Config(configPath).loadSync({
  packageConfig
});
class App extends AlpNodeApp {
  constructor(options) {
    super({ ...options,
      appDirname,
      packageDirname,
      config
    });
  }

}

exports.Config = _config.Config;
exports.appDirname = appDirname;
exports.config = config;
exports.default = App;
exports.packageConfig = packageConfig;
exports.packageDirname = packageDirname;
//# sourceMappingURL=index-node12-dev.cjs.js.map
