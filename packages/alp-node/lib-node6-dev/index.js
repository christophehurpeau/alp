'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MigrationsManager = exports.newController = exports.Config = undefined;

var _alpConfig = require('alp-config');

Object.defineProperty(exports, 'Config', {
  enumerable: true,
  get: function get() {
    return _alpConfig.Config;
  }
});

var _alpController = require('alp-controller');

Object.defineProperty(exports, 'newController', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_alpController).default;
  }
});

var _alpMigrations = require('alp-migrations');

Object.defineProperty(exports, 'MigrationsManager', {
  enumerable: true,
  get: function get() {
    return _alpMigrations.MigrationsManager;
  }
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

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

var _alpMigrations2 = _interopRequireDefault(_alpMigrations);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _findupSync = require('findup-sync');

var _findupSync2 = _interopRequireDefault(_findupSync);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp');

class Alp extends _koa2.default {

  /**
   * @param {Object} [options]
   * @param {string} [options.dirname] directory of the application
   * @param {string} [options.certPath] directory of the ssl certificates
   * @param {string} [options.publicPath] directory of public files
   * @param {Config} [options.config] alp-config object
   * @param {Array} [options.argv] deprecated, list of overridable config by argv
   */
  constructor() {
    let options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    super();
    if (options.packageDirname) (0, _util.deprecate)(() => () => null, 'options.packageDirname')();
    if (options.srcDirname) {
      (0, _util.deprecate)(() => () => null, 'options.srcDirname: use dirname instead')();
      options.dirname = options.srcDirname;
    }
    if (!options.dirname) options.dirname = process.cwd();

    this.dirname = options.dirname;

    const packagePath = (0, _findupSync2.default)('package.json', { cwd: options.dirname });
    if (!packagePath) throw new Error(`Could not find package.json: "${ packagePath }"`);
    const packageDirname = _path2.default.dirname(packagePath);

    Object.defineProperty(this, 'packageDirname', {
      get: (0, _util.deprecate)(() => packageDirname, 'packageDirname'),
      configurable: false,
      enumerable: false
    });

    this.certPath = options.certPath || `${ this.packageDirname }/config/cert`;
    this.publicPath = options.publicPath || `${ this.packageDirname }/public/`;

    if (!options.config) {
      (0, _util.deprecate)(() => () => null, 'Alp options: missing options.config')();
      // eslint-disable-next-line
      const packageConfig = require(`${ options.packageDirname }/package.json`);
      (0, _alpConfig2.default)(`${ this.dirname }/config`, { packageConfig, argv: options.argv })(this);
    } else {
      (0, _alpConfig2.default)()(this, options.config);
    }

    (0, _alpParams2.default)(this);
    (0, _alpLanguage2.default)(this);
    (0, _alpTranslate2.default)('locales')(this);

    this.use((0, _koaCompress2.default)());

    this.browserStateTransformers = [];
    this.browserContextTransformers = [(initialBrowserContext, context) => {
      initialBrowserContext.state = Object.create(null);
      this.browserStateTransformers.forEach(transformer => transformer(initialBrowserContext.state, context));
    }];

    this.context.computeInitialContextForBrowser = function () {
      const initialBrowserContext = Object.create(null);

      this.app.browserContextTransformers.forEach(transformer => transformer(initialBrowserContext, this));

      return initialBrowserContext;
    };
  }

  registerBrowserContextTransformer(transformer) {
    _assert(transformer, _tcombForked2.default.Function, 'transformer');

    this.browserContextTransformers.push(transformer);
  }

  registerBrowserStateTransformer(transformer) {
    _assert(transformer, _tcombForked2.default.Function, 'transformer');

    this.browserStateTransformers.push(transformer);
  }

  registerBrowserStateTransformers(transformer) {
    (0, _util.deprecate)(() => () => null, 'breaking: use registerBrowserStateTransformer instead')();
    this.browserStateTransformers.push(transformer);
  }

  migrate(migrationsManager) {
    return (0, _alpMigrations2.default)({
      config: this.config,
      dirname: `${ this.dirname }/migrations`,
      migrationsManager
    });
  }

  get environment() {
    (0, _util.deprecate)(() => () => null, 'app.environment, use app.env instead')();
    return this.env;
  }

  get production() {
    (0, _util.deprecate)(() => () => null, 'app.production, use global.PRODUCTION instead')();
    return this.env === 'prod' || this.env === 'production';
  }
  servePublic() {
    this.use((0, _koaStatic2.default)(this.publicPath)); // static files
  }

  catchErrors() {
    this.use(_alpErrorsNode2.default);
  }

  listen() {
    return (0, _alpListen2.default)(this.certPath)(this).then(server => this._server = server).catch(err => {
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
    _assert(fn, _tcombForked2.default.Function, 'fn');

    fn().then(() => logger.success('started')).catch(err => logger.error('start fail', { err }));
  }
}
exports.default = Alp;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }

    return type(x);
  }

  if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map