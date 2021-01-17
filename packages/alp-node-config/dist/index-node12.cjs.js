'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const fs = require('fs');
const deepFreeze = require('deep-freeze-es6');
const argv = require('minimist-argv');
const parseJSON = require('parse-json-object-as-map');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const deepFreeze__default = /*#__PURE__*/_interopDefaultLegacy(deepFreeze);
const argv__default = /*#__PURE__*/_interopDefaultLegacy(argv);
const parseJSON__default = /*#__PURE__*/_interopDefaultLegacy(parseJSON);

function _existsConfigSync(dirname, name) {
  return fs.existsSync(`${dirname}${name}.json`);
}

function _loadConfigSync(dirname, name) {
  const content = fs.readFileSync(`${dirname}${name}.json`, 'utf-8');
  return parseJSON__default(content);
}

class Config {
  constructor(dirname, options) {
    this._map = new Map();
    this._dirname = dirname.replace(/\/*$/, '/');

    if (options) {
      this.loadSync(options);
    }
  }

  loadSync(options = {}) {
    const env = process.env.CONFIG_ENV || process.env.NODE_ENV || 'development';
    const {
      argv: argvOverrides = [],
      packageConfig,
      version
    } = options;
    this.packageConfig = packageConfig;
    const config = this.loadConfigSync('common'); // eslint-disable-next-line no-restricted-syntax

    for (const [key, value] of this.loadConfigSync(env)) {
      config.set(key, value);
    }

    if (this.existsConfigSync('local')) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of this.loadConfigSync('local')) {
        config.set(key, value);
      }
    }

    if (config.has('version')) {
      throw new Error('Cannot have "version", in config.');
    }

    config.set('version', String(version || argv__default.version || (packageConfig === null || packageConfig === void 0 ? void 0 : packageConfig.version)));
    const socketPath = argv__default['socket-path'] || argv__default.socketPath;

    if (socketPath) {
      config.set('socketPath', socketPath);
    } else if (argv__default.port) {
      config.set('port', argv__default.port);
      config.delete('socketPath');
    } else if (process.env.PORT) {
      config.set('port', Number(process.env.PORT));
      config.delete('socketPath');
    }

    argvOverrides.forEach(key => {
      const splitted = key.split('.');
      const value = splitted.length > 0 && splitted.reduce((config, partialKey) => config === null || config === void 0 ? void 0 : config[partialKey], argv__default);

      if (value !== undefined) {
        const last = splitted.pop();
        const map = splitted.length === 0 ? config : splitted.reduce((config, partialKey) => config.get(partialKey), config);
        map.set(last, value);
      }
    });
    this._map = deepFreeze__default(config);
    return this;
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
function getConfig(app, config) {
  return config;
}

exports.Config = Config;
exports.default = getConfig;
//# sourceMappingURL=index-node12.cjs.js.map
