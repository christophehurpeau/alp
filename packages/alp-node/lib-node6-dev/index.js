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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp');

class Alp extends _koa2.default {

  /**
   * @param {Object} [options]
   * @param {string} [options.srcDirname] directory of the application
   * @param {Config} [options.config] alp-config object
   * @param {string} [options.packageDirname] deprecated, directory of the package
   * @param {Array} [options.argv] deprecated, list of overridable config by argv
   */
  constructor() {
    let options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    super();
    if (!options.packageDirname) options.packageDirname = process.cwd();
    if (!options.srcDirname) options.srcDirname = `${ options.packageDirname }/lib`;

    this.dirname = options.srcDirname;

    if (!(typeof this.dirname === 'string')) {
      throw new TypeError('Value of "this.dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(this.dirname));
    }

    Object.defineProperty(this, 'packageDirname', {
      get: (0, _util.deprecate)(() => {
        return options.packageDirname;
      }, 'packageDirname'),
      configurable: false,
      enumerable: false
    });

    if (!options.config) {
      (0, _util.deprecate)(() => {
        return () => {
          return null;
        };
      }, 'Alp options: missing options.config')();
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

    if (!(Array.isArray(this.browserStateTransformers) && this.browserStateTransformers.every(function (item) {
      return typeof item === 'function';
    }))) {
      throw new TypeError('Value of "this.browserStateTransformers" violates contract.\n\nExpected:\nArray<Function>\n\nGot:\n' + _inspect(this.browserStateTransformers));
    }

    this.browserContextTransformers = [(initialBrowserContext, context) => {
      initialBrowserContext.state = Object.create(null);
      this.browserStateTransformers.forEach(transformer => {
        return transformer(initialBrowserContext.state, context);
      });
    }];

    this.context.computeInitialContextForBrowser = function () {
      const initialBrowserContext = Object.create(null);

      this.app.browserContextTransformers.forEach(transformer => {
        return transformer(initialBrowserContext, this);
      });

      return initialBrowserContext;
    };
  }

  registerBrowserContextTransformer(transformer) {
    if (!(typeof transformer === 'function')) {
      throw new TypeError('Value of argument "transformer" violates contract.\n\nExpected:\nFunction\n\nGot:\n' + _inspect(transformer));
    }

    this.browserContextTransformers.push(transformer);
  }

  registerBrowserStateTransformer(transformer) {
    if (!(typeof transformer === 'function')) {
      throw new TypeError('Value of argument "transformer" violates contract.\n\nExpected:\nFunction\n\nGot:\n' + _inspect(transformer));
    }

    this.browserStateTransformers.push(transformer);
  }

  registerBrowserStateTransformers(transformer) {
    (0, _util.deprecate)(() => {
      return () => {
        return null;
      };
    }, 'breaking: use registerBrowserStateTransformer instead')();
    this.browserStateTransformers.push(transformer);
  }

  migrate(migrationsManager) {
    return (0, _alpMigrations2.default)({
      config: this.config,
      dirname: this.dirname,
      migrationsManager
    });
  }

  get environment() {
    (0, _util.deprecate)(() => {
      return () => {
        return null;
      };
    }, 'app.environment, use app.env instead')();
    return this.env;
  }

  get production() {
    (0, _util.deprecate)(() => {
      return () => {
        return null;
      };
    }, 'app.production, use global.PRODUCTION instead')();
    return this.env === 'prod' || this.env === 'production';
  }
  servePublic() {
    this.use((0, _koaStatic2.default)(`${ this.packageDirname }/public/`)); // static files
  }

  catchErrors() {
    this.use(_alpErrorsNode2.default);
  }

  listen() {
    return (0, _alpListen2.default)(`${ this.packageDirname }/config/cert`)(this).catch(err => {
      logger.error(err);
      throw err;
    });
  }
}
exports.default = Alp;

function _inspect(input, depth) {
  const maxDepth = 4;
  const maxKeys = 15;

  if (depth === undefined) {
    depth = 0;
  }

  depth += 1;

  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input;
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      if (depth > maxDepth) return '[...]';

      const first = _inspect(input[0], depth);

      if (input.every(item => _inspect(item, depth) === first)) {
        return first.trim() + '[]';
      } else {
        return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
      }
    } else {
      return 'Array';
    }
  } else {
    const keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    if (depth > maxDepth) return '{...}';
    const indent = '  '.repeat(depth - 1);
    let entries = keys.slice(0, maxKeys).map(key => {
      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
    }).join('\n  ' + indent);

    if (keys.length >= maxKeys) {
      entries += '\n  ' + indent + '...';
    }

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
    } else {
      return '{\n  ' + indent + entries + '\n' + indent + '}';
    }
  }
}
//# sourceMappingURL=index.js.map