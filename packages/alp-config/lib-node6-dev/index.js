'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = alpConfig;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _util = require('util');

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

var _deepFreezeEs = require('deep-freeze-es6');

var _deepFreezeEs2 = _interopRequireDefault(_deepFreezeEs);

var _parseJsonObjectAsMap = require('parse-json-object-as-map');

var _parseJsonObjectAsMap2 = _interopRequireDefault(_parseJsonObjectAsMap);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _existsConfigSync(dirname, name) {
  _assert(dirname, _tcombForked2.default.String, 'dirname');

  _assert(name, _tcombForked2.default.String, 'name');

  return (0, _fs.existsSync)(`${ dirname }${ name }.json`);
}

function _loadConfigSync(dirname, name) {
  _assert(dirname, _tcombForked2.default.String, 'dirname');

  _assert(name, _tcombForked2.default.String, 'name');

  let content = (0, _fs.readFileSync)(`${ dirname }${ name }.json`);
  return (0, _parseJsonObjectAsMap2.default)(content);
}

const ConfigOptions = _tcombForked2.default.interface({
  argv: _tcombForked2.default.maybe(_tcombForked2.default.list(_tcombForked2.default.String)),
  packageConfig: _tcombForked2.default.maybe(_tcombForked2.default.Object),
  version: _tcombForked2.default.maybe(_tcombForked2.default.String)
}, 'ConfigOptions');

class Config {

  constructor(dirname) {
    _assert(dirname, _tcombForked2.default.String, 'dirname');

    this._map = new Map();
    this._dirname = dirname.replace(/\/*$/, '/');
  }

  loadSync() {
    let options = _assert(arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, ConfigOptions, 'options');

    _assert(options, ConfigOptions, 'options');

    return _assert(function () {
      const env = process.env.CONFIG_ENV || process.env.NODE_ENV || 'development';
      var _options$argv = options.argv;
      const argvOverrides = _options$argv === undefined ? [] : _options$argv,
            packageConfig = options.packageConfig,
            version = options.version;

      this.packageConfig = packageConfig;

      const config = this.loadConfigSync('common');
      // eslint-disable-next-line no-restricted-syntax
      for (let _ref of this.loadConfigSync(env)) {
        var _ref2 = _slicedToArray(_ref, 2);

        let key = _ref2[0];
        let value = _ref2[1];

        config.set(key, value);
      }

      if (this.existsConfigSync('local')) {
        // eslint-disable-next-line no-restricted-syntax
        for (let _ref3 of this.loadConfigSync('local')) {
          var _ref4 = _slicedToArray(_ref3, 2);

          let key = _ref4[0];
          let value = _ref4[1];

          config.set(key, value);
        }
      }

      if (config.has('version')) {
        throw new Error('Cannot have "version", in config.');
      }

      config.set('version', version || _minimistArgv2.default.version || packageConfig.version);

      let socketPath = _minimistArgv2.default['socket-path'] || _minimistArgv2.default.socketPath;
      if (socketPath) {
        config.set('socketPath', socketPath);
      } else if (_minimistArgv2.default.port) {
        config.set('port', _minimistArgv2.default.port);
        config.delete('socketPath');
      }

      argvOverrides.forEach(key => {
        const splitted = key.split('.');
        const value = splitted.length !== 0 && splitted.reduce((config, partialKey) => config && config[partialKey], _minimistArgv2.default);
        if (value !== undefined) {
          const last = splitted.pop();
          const map = splitted.length === 0 ? config : splitted.reduce((config, partialKey) => config.get(partialKey), config);
          map.set(last, value);
        }
      });

      return this._map = (0, _deepFreezeEs2.default)(config);
    }.apply(this, arguments), Map, 'return value');
  }

  get(key) {
    _assert(key, _tcombForked2.default.String, 'key');

    return _assert(function () {
      return this._map.get(key);
    }.apply(this, arguments), _tcombForked2.default.Any, 'return value');
  }

  existsConfigSync(name) {
    _assert(name, _tcombForked2.default.String, 'name');

    return _assert(function () {
      return _existsConfigSync(this._dirname, name);
    }.apply(this, arguments), _tcombForked2.default.Boolean, 'return value');
  }

  loadConfigSync(name) {
    _assert(name, _tcombForked2.default.String, 'name');

    return _assert(function () {
      return _loadConfigSync(this._dirname, name);
    }.apply(this, arguments), Map, 'return value');
  }
}

exports.Config = Config;
function alpConfig(dirname) {
  let options = _assert(arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}, ConfigOptions, 'options');

  _assert(dirname, _tcombForked2.default.maybe(_tcombForked2.default.String), 'dirname');

  _assert(options, ConfigOptions, 'options');

  return function (app, config) {
    _assert(config, _tcombForked2.default.maybe(Config), 'config');

    if (!config) {
      config = new Config(dirname, options);
      config.loadSync(options);
    }

    app.existsConfig = (0, _util.deprecate)(name => config.existsConfigSync(name), 'use app.existsConfigSync');
    app.loadConfig = (0, _util.deprecate)(name => config.loadConfigSync(name), 'use app.loadConfigSync');

    app.existsConfigSync = name => config.existsConfigSync(name);
    app.loadConfigSync = name => config.loadConfigSync(name);

    app.config = config;
    app.context.config = config;

    return config;
  }.bind(this);
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map