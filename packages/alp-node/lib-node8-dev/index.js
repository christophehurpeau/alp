'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.config = exports.packageConfig = exports.packageDirname = exports.appDirname = exports.Config = void 0;

var _dec, _dec2, _dec3, _dec4, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4;

var _alpConfig = require('alp-config');

Object.defineProperty(exports, 'Config', {
  enumerable: true,
  get: function () {
    return _alpConfig.Config;
  }
});

var _fs = require('fs');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('util');

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaCompress = require('koa-compress');

var _koaCompress2 = _interopRequireDefault(_koaCompress);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _alpConfig2 = _interopRequireDefault(_alpConfig);

var _alpErrorsNode = require('alp-errors-node');

var _alpErrorsNode2 = _interopRequireDefault(_alpErrorsNode);

var _alpParams = require('alp-params');

var _alpParams2 = _interopRequireDefault(_alpParams);

var _alpLanguage = require('alp-language');

var _alpLanguage2 = _interopRequireDefault(_alpLanguage);

var _alpTranslate = require('alp-translate');

var _alpTranslate2 = _interopRequireDefault(_alpTranslate);

var _alpListen = require('alp-listen');

var _alpListen2 = _interopRequireDefault(_alpListen);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _findupSync = require('findup-sync');

var _findupSync2 = _interopRequireDefault(_findupSync);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
  descriptor && Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  return Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  }), desc.enumerable = !!desc.enumerable, desc.configurable = !!desc.configurable, ('value' in desc || desc.initializer) && (desc.writable = true), desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc), context && desc.initializer !== void 0 && (desc.value = desc.initializer ? desc.initializer.call(context) : void 0, desc.initializer = void 0), desc.initializer === void 0 && (Object['defineProperty'](target, property, desc), desc = null), desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

const logger = new _nightingaleLogger2.default('alp');

const appDirname = exports.appDirname = _path2.default.dirname(process.argv[1]);

const packagePath = (0, _findupSync2.default)('package.json', { cwd: appDirname });
if (!packagePath) throw new Error(`Could not find package.json: "${packagePath}"`);
const packageDirname = exports.packageDirname = _path2.default.dirname(packagePath);

logger.debug('init', { appDirname, packageDirname });


// eslint-disable-next-line import/no-dynamic-require, global-require
const packageConfig = exports.packageConfig = require(packagePath);

const buildedConfigPath = `${appDirname}/build/config/`;
const configPath = (0, _fs.existsSync)(buildedConfigPath) ? buildedConfigPath : `${appDirname}/config/`;
const config = exports.config = new _alpConfig.Config(configPath);
config.loadSync({ packageConfig });
let Alp = (_dec = _flowRuntime2.default.decorate(_flowRuntime2.default.string()), _dec2 = _flowRuntime2.default.decorate(_flowRuntime2.default.string()), _dec3 = _flowRuntime2.default.decorate(_flowRuntime2.default.array(_flowRuntime2.default.function())), _dec4 = _flowRuntime2.default.decorate(_flowRuntime2.default.array(_flowRuntime2.default.function())), _class = class extends _koa2.default {

  /**
   * @param {Object} [options]
   * @param {string} [options.dirname] directory of the application
   * @param {string} [options.certPath] directory of the ssl certificates
   * @param {string} [options.publicPath] directory of public files
   * @param {Config} [options.config] alp-config object
   * @param {Array} [options.argv] deprecated, list of overridable config by argv
   */
  constructor(options = {}) {
    if (super(), _initDefineProp(this, 'dirname', _descriptor, this), _initDefineProp(this, 'packageDirname', _descriptor2, this), _initDefineProp(this, 'reduxReducers', _descriptor3, this), _initDefineProp(this, 'reduxMiddlewares', _descriptor4, this), options.packageDirname) throw new Error('options.packageDirname is deprecated');
    if (options.config) throw new Error('options.config is deprecated');
    if (options.srcDirname) throw new Error('options.srcDirname is deprecated');
    if (options.dirname) throw new Error('options.dirname is deprecated');

    this.dirname = _path2.default.normalize(appDirname), Object.defineProperty(this, 'packageDirname', {
      get: (0, _util.deprecate)(() => packageDirname, 'packageDirname'),
      configurable: false,
      enumerable: false
    }), this.certPath = options.certPath || `${packageDirname}/config/cert`, this.publicPath = options.publicPath || `${packageDirname}/public/`, (0, _alpConfig2.default)()(this, config), (0, _alpParams2.default)(this), (0, _alpLanguage2.default)(this), (0, _alpTranslate2.default)('locales')(this), this.use((0, _koaCompress2.default)());
  }

  get environment() {
    return (0, _util.deprecate)(() => () => null, 'app.environment, use app.env instead')(), this.env;
  }

  get production() {
    return (0, _util.deprecate)(() => () => null, 'app.production, use global.PRODUCTION instead')(), this.env === 'prod' || this.env === 'production';
  }
  servePublic() {
    this.use((0, _koaStatic2.default)(this.publicPath));
  }

  catchErrors() {
    this.use(_alpErrorsNode2.default);
  }

  listen() {
    return (0, _alpListen2.default)(this.certPath)(this).then(server => this._server = server).catch(err => {
      throw logger.error(err), err;
    });
  }

  /**
   * Close server and emit close event
   */
  close() {
    this._server && (this._server.close(), this.emit('close'));
  }

  start(fn) {
    let _fnType = _flowRuntime2.default.function();

    _flowRuntime2.default.param('fn', _fnType).assert(fn), fn().then(() => logger.success('started')).catch(err => logger.error('start fail', { err }));
  }
}, _descriptor = _applyDecoratedDescriptor(_class.prototype, 'dirname', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'packageDirname', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'reduxReducers', [_dec3], {
  enumerable: true,
  initializer: function () {
    return [];
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'reduxMiddlewares', [_dec4], {
  enumerable: true,
  initializer: function () {
    return [];
  }
}), _class);
exports.default = Alp;
//# sourceMappingURL=index.js.map