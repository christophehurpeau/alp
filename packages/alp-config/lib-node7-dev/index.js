'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = undefined;
exports.default = alpConfig;

var _util = require('util');

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

var _deepFreezeEs = require('deep-freeze-es6');

var _deepFreezeEs2 = _interopRequireDefault(_deepFreezeEs);

var _parseJsonObjectAsMap = require('parse-json-object-as-map');

var _parseJsonObjectAsMap2 = _interopRequireDefault(_parseJsonObjectAsMap);

var _fs = require('fs');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _existsConfigSync(dirname, name) {
  let _dirnameType = _flowRuntime2.default.string();

  let _nameType = _flowRuntime2.default.string();

  _flowRuntime2.default.param('dirname', _dirnameType).assert(dirname);

  _flowRuntime2.default.param('name', _nameType).assert(name);

  return (0, _fs.existsSync)(`${dirname}${name}.json`);
}

function _loadConfigSync(dirname, name) {
  let _dirnameType2 = _flowRuntime2.default.string();

  let _nameType2 = _flowRuntime2.default.string();

  _flowRuntime2.default.param('dirname', _dirnameType2).assert(dirname);

  _flowRuntime2.default.param('name', _nameType2).assert(name);

  let content = (0, _fs.readFileSync)(`${dirname}${name}.json`);
  return (0, _parseJsonObjectAsMap2.default)(content);
}

const ConfigOptions = _flowRuntime2.default.type('ConfigOptions', _flowRuntime2.default.object(_flowRuntime2.default.property('argv', _flowRuntime2.default.array(_flowRuntime2.default.string()), true), _flowRuntime2.default.property('packageConfig', _flowRuntime2.default.object(), true), _flowRuntime2.default.property('version', _flowRuntime2.default.string(), true)));

class Config {

  constructor(dirname) {
    let _dirnameType3 = _flowRuntime2.default.string();

    _flowRuntime2.default.param('dirname', _dirnameType3).assert(dirname);

    this._map = new Map();
    this._dirname = dirname.replace(/\/*$/, '/');
  }

  loadSync(options = {}) {
    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref('Map'));

    _flowRuntime2.default.param('options', ConfigOptions).assert(options);

    const env = process.env.CONFIG_ENV || process.env.NODE_ENV || 'development';
    const { argv: argvOverrides = [], packageConfig, version } = options;
    this.packageConfig = packageConfig;

    const config = this.loadConfigSync('common');
    // eslint-disable-next-line no-restricted-syntax
    for (let [key, value] of this.loadConfigSync(env)) {
      config.set(key, value);
    }

    if (this.existsConfigSync('local')) {
      // eslint-disable-next-line no-restricted-syntax
      for (let [key, value] of this.loadConfigSync('local')) {
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
    } else if (process.env.PORT) {
      config.set('port', Number(process.env.PORT));
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

    return _returnType.assert(this._map = (0, _deepFreezeEs2.default)(config));
  }

  get(key) {
    let _keyType = _flowRuntime2.default.string();

    const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.any());

    _flowRuntime2.default.param('key', _keyType).assert(key);

    return _returnType2.assert(this._map.get(key));
  }

  existsConfigSync(name) {
    let _nameType3 = _flowRuntime2.default.string();

    const _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.boolean());

    _flowRuntime2.default.param('name', _nameType3).assert(name);

    return _returnType3.assert(_existsConfigSync(this._dirname, name));
  }

  loadConfigSync(name) {
    let _nameType4 = _flowRuntime2.default.string();

    const _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.ref('Map'));

    _flowRuntime2.default.param('name', _nameType4).assert(name);

    return _returnType4.assert(_loadConfigSync(this._dirname, name));
  }
}

exports.Config = Config;
function alpConfig(dirname, options = {}) {
  let _dirnameType4 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  _flowRuntime2.default.param('dirname', _dirnameType4).assert(dirname);

  _flowRuntime2.default.param('options', ConfigOptions).assert(options);

  return (app, config) => {
    let _configType = _flowRuntime2.default.nullable(_flowRuntime2.default.ref(Config));

    _flowRuntime2.default.param('config', _configType).assert(config);

    if (!config) {
      config = _configType.assert(new Config(dirname, options));
      config.loadSync(options);
    }

    app.existsConfig = (0, _util.deprecate)(name => config.existsConfigSync(name), 'use app.existsConfigSync');
    app.loadConfig = (0, _util.deprecate)(name => config.loadConfigSync(name), 'use app.loadConfigSync');

    app.existsConfigSync = name => config.existsConfigSync(name);
    app.loadConfigSync = name => config.loadConfigSync(name);

    app.config = config;
    app.context.config = config;

    return config;
  };
}
//# sourceMappingURL=index.js.map