import { deprecate } from 'util';
import argv from 'minimist-argv';
import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import { existsSync, readFileSync } from 'fs';

function _existsConfigSync(dirname, name) {
  return existsSync(`${dirname}${name}.json`);
}

function _loadConfigSync(dirname, name) {
  let content = readFileSync(`${dirname}${name}.json`);
  return parseJSON(content);
}

export class Config {

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

    config.set('version', version || argv.version || packageConfig.version);

    let socketPath = argv['socket-path'] || argv.socketPath;
    if (socketPath) {
      config.set('socketPath', socketPath);
    } else if (argv.port) {
      config.set('port', argv.port);
      config.delete('socketPath');
    } else if (process.env.PORT) {
      config.set('port', Number(process.env.PORT));
      config.delete('socketPath');
    }

    argvOverrides.forEach(function (key) {
      const splitted = key.split('.');
      const value = splitted.length !== 0 && splitted.reduce(function (config, partialKey) {
        return config && config[partialKey];
      }, argv);
      if (value !== undefined) {
        const last = splitted.pop();
        const map = splitted.length === 0 ? config : splitted.reduce(function (config, partialKey) {
          return config.get(partialKey);
        }, config);
        map.set(last, value);
      }
    });

    return this._map = deepFreeze(config);
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

export default function alpConfig(dirname, options = {}) {
  return function (app, config) {
    if (!config) {
      config = new Config(dirname, options);
      config.loadSync(options);
    }

    app.existsConfig = deprecate(function (name) {
      return config.existsConfigSync(name);
    }, 'use app.existsConfigSync');
    app.loadConfig = deprecate(function (name) {
      return config.loadConfigSync(name);
    }, 'use app.loadConfigSync');

    app.existsConfigSync = function (name) {
      return config.existsConfigSync(name);
    };
    app.loadConfigSync = function (name) {
      return config.loadConfigSync(name);
    };

    app.config = config;
    app.context.config = config;

    return config;
  };
}
//# sourceMappingURL=index.js.map