import _t from 'tcomb-forked';
import { deprecate } from 'util';
import argv from 'minimist-argv';
import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import { existsSync, readFileSync } from 'fs';

function _existsConfigSync(dirname, name) {
  _assert(dirname, _t.String, 'dirname');

  _assert(name, _t.String, 'name');

  return existsSync(`${dirname}${name}.json`);
}

function _loadConfigSync(dirname, name) {
  _assert(dirname, _t.String, 'dirname');

  _assert(name, _t.String, 'name');

  let content = readFileSync(`${dirname}${name}.json`);
  return parseJSON(content);
}

const ConfigOptions = _t.interface({
  argv: _t.maybe(_t.list(_t.String)),
  packageConfig: _t.maybe(_t.Object),
  version: _t.maybe(_t.String)
}, 'ConfigOptions');

export class Config {

  constructor(dirname) {
    _assert(dirname, _t.String, 'dirname');

    this._map = new Map();
    this._dirname = dirname.replace(/\/*$/, '/');
  }

  loadSync(options = {}) {
    _assert(options, ConfigOptions, 'options');

    return _assert(function () {
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
    }.apply(this, arguments), Map, 'return value');
  }

  get(key) {
    _assert(key, _t.String, 'key');

    return _assert(function () {
      return this._map.get(key);
    }.apply(this, arguments), _t.Any, 'return value');
  }

  existsConfigSync(name) {
    _assert(name, _t.String, 'name');

    return _assert(function () {
      return _existsConfigSync(this._dirname, name);
    }.apply(this, arguments), _t.Boolean, 'return value');
  }

  loadConfigSync(name) {
    _assert(name, _t.String, 'name');

    return _assert(function () {
      return _loadConfigSync(this._dirname, name);
    }.apply(this, arguments), Map, 'return value');
  }
}

export default function alpConfig(dirname, options = {}) {
  _assert(dirname, _t.maybe(_t.String), 'dirname');

  _assert(options, ConfigOptions, 'options');

  return function (app, config) {
    _assert(config, _t.maybe(Config), 'config');

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

function _assert(x, type, name) {
  if (_t.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _t.fail('Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=index.js.map