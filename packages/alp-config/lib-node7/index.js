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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _existsConfigSync(dirname, name) {
  return (0, _fs.existsSync)(`${dirname}${name}.json`);
}

function _loadConfigSync(dirname, name) {
  let content = (0, _fs.readFileSync)(`${dirname}${name}.json`);
  return (0, _parseJsonObjectAsMap2.default)(content);
}

class Config {

  constructor(dirname) {
    this._map = new Map();
    this._dirname = dirname.replace(/\/*$/, '/');
  }

  loadSync(options = {}) {
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

    return this._map = (0, _deepFreezeEs2.default)(config);
  }

  get(key) {
    return this._map.get(key);
  }

  existsConfigSync(name) {
    return _existsConfigSync(this._dirname, name);
  }

  loadConfigSync(name) {
    return _loadConfigSync(this._dirname, name);
  }
}

exports.Config = Config;
function alpConfig(dirname, options = {}) {
  return (app, config) => {
    if (!config) {
      config = new Config(dirname);
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