'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const fs = require('fs');
const argv = _interopDefault(require('minimist-argv'));
const deepFreeze = _interopDefault(require('deep-freeze-es6'));
const parseJSON = _interopDefault(require('parse-json-object-as-map'));

function _existsConfigSync(dirname, name) {
  return fs.existsSync(`${dirname}${name}.json`);
}

function _loadConfigSync(dirname, name) {
  const content = fs.readFileSync(`${dirname}${name}.json`, 'utf-8');
  return parseJSON(content);
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

    config.set('version', String(version || argv.version || packageConfig && packageConfig.version));
    const socketPath = argv['socket-path'] || argv.socketPath;

    if (socketPath) {
      config.set('socketPath', socketPath);
    } else if (argv.port) {
      config.set('port', argv.port);
      config.delete('socketPath');
    } else if (process.env.PORT) {
      config.set('port', Number(process.env.PORT));
      config.delete('socketPath');
    }

    argvOverrides.forEach(key => {
      const splitted = key.split('.');
      const value = splitted.length !== 0 && splitted.reduce((config, partialKey) => config && config[partialKey], argv);

      if (value !== undefined) {
        const last = splitted.pop();
        const map = splitted.length === 0 ? config : splitted.reduce((config, partialKey) => config.get(partialKey), config);
        map.set(last, value);
      }
    });
    this._map = deepFreeze(config);
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
//# sourceMappingURL=index-node8-dev.cjs.js.map
