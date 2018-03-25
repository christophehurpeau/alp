'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs');
var path = _interopDefault(require('path'));
var util = require('util');
var Koa = _interopDefault(require('koa'));
var compress = _interopDefault(require('koa-compress'));
var serve = _interopDefault(require('koa-static'));
var _config = require('alp-config');
var _config__default = _interopDefault(_config);
var errors = _interopDefault(require('alp-errors-node'));
var params = _interopDefault(require('alp-params'));
var language = _interopDefault(require('alp-language'));
var translate = _interopDefault(require('alp-translate'));
var _listen = _interopDefault(require('alp-listen'));
var Logger = _interopDefault(require('nightingale-logger'));
var findUp = _interopDefault(require('findup-sync'));

const logger = new Logger('alp');

const appDirname = path.dirname(process.argv[1]);

const packagePath = findUp('package.json', { cwd: appDirname });
if (!packagePath) throw new Error(`Could not find package.json: "${packagePath}"`);
const packageDirname = path.dirname(packagePath);

logger.debug('init', { appDirname, packageDirname });

// eslint-disable-next-line import/no-dynamic-require, global-require
const packageConfig = JSON.parse(fs.readFileSync(packagePath));

const buildedConfigPath = `${appDirname}/build/config/`;
const configPath = fs.existsSync(buildedConfigPath) ? buildedConfigPath : `${appDirname}/config/`;
const config = new _config.Config(configPath);
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
      get: util.deprecate(() => packageDirname, 'packageDirname'),
      configurable: false,
      enumerable: false
    });

    this.certPath = options.certPath || `${packageDirname}/config/cert`;
    this.publicPath = options.publicPath || `${packageDirname}/public/`;

    _config__default()(this, config);

    params(this);
    language(this);
    translate('locales')(this);

    this.use(compress());
  }

  get environment() {
    util.deprecate(() => () => null, 'app.environment, use app.env instead')();
    return this.env;
  }

  get production() {
    util.deprecate(() => () => null, 'app.production, use global.PRODUCTION instead')();
    return this.env === 'prod' || this.env === 'production';
  }
  servePublic() {
    this.use(serve(this.publicPath)); // static files
  }

  catchErrors() {
    this.use(errors);
  }

  listen() {
    return _listen(this.certPath)(this).then(server => {
      this._server = server;
      return server;
    }).catch(err => {
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

exports.Config = _config.Config;
exports.appDirname = appDirname;
exports.packageDirname = packageDirname;
exports.packageConfig = packageConfig;
exports.config = config;
exports.default = Alp;
//# sourceMappingURL=index-node8.cjs.js.map
