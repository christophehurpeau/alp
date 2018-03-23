'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs');
var util = require('util');
var argv = _interopDefault(require('minimist-argv'));
var deepFreeze = _interopDefault(require('deep-freeze-es6'));
var parseJSON = _interopDefault(require('parse-json-object-as-map'));
var t = _interopDefault(require('flow-runtime'));

function _existsConfigSync(dirname, name) {
  let _dirnameType = t.string();

  let _nameType = t.string();

  t.param('dirname', _dirnameType).assert(dirname);
  t.param('name', _nameType).assert(name);

  return fs.existsSync(`${dirname}${name}.json`);
}

function _loadConfigSync(dirname, name) {
  let _dirnameType2 = t.string();

  let _nameType2 = t.string();

  t.param('dirname', _dirnameType2).assert(dirname);
  t.param('name', _nameType2).assert(name);

  const content = fs.readFileSync(`${dirname}${name}.json`);
  return parseJSON(content);
}

const ConfigOptions = t.type('ConfigOptions', t.exactObject(t.property('argv', t.nullable(t.array(t.string())), true), t.property('packageConfig', t.nullable(t.object()), true), t.property('version', t.nullable(t.string()), true)));


let Config = class {

  constructor(dirname) {
    let _dirnameType3 = t.string();

    t.param('dirname', _dirnameType3).assert(dirname);

    this._map = new Map();
    this._dirname = dirname.replace(/\/*$/, '/');
  }

  loadSync(options = {}) {
    const _returnType = t.return(t.ref('Map', t.string(), t.any()));

    t.param('options', ConfigOptions).assert(options);

    const env = process.env.CONFIG_ENV || process.env.NODE_ENV || 'development';
    const { argv: argvOverrides = [], packageConfig, version } = options;
    this.packageConfig = packageConfig;

    const config = this.loadConfigSync('common');
    // eslint-disable-next-line no-restricted-syntax
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

    config.set('version', version || argv.version || packageConfig.version);

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
    return _returnType.assert(this._map);
  }

  get(key) {
    let _keyType = t.string();

    const _returnType2 = t.return(t.any());

    t.param('key', _keyType).assert(key);

    return _returnType2.assert(this._map.get(key));
  }

  existsConfigSync(name) {
    let _nameType3 = t.string();

    const _returnType3 = t.return(t.boolean());

    t.param('name', _nameType3).assert(name);

    return _returnType3.assert(_existsConfigSync(this._dirname, name));
  }

  loadConfigSync(name) {
    let _nameType4 = t.string();

    const _returnType4 = t.return(t.ref('Map', t.string(), t.any()));

    t.param('name', _nameType4).assert(name);

    return _returnType4.assert(_loadConfigSync(this._dirname, name));
  }
};

function alpConfig(dirname, options = {}) {
  let _dirnameType4 = t.nullable(t.string());

  t.param('dirname', _dirnameType4).assert(dirname);
  t.param('options', ConfigOptions).assert(options);

  return (app, config) => {
    let _configType = t.nullable(t.ref(Config));

    t.param('config', _configType).assert(config);

    if (!config) {
      config = _configType.assert(new Config(dirname));
      config.loadSync(options);
    }

    app.existsConfig = util.deprecate(name => config.existsConfigSync(name), 'use app.existsConfigSync');
    app.loadConfig = util.deprecate(name => config.loadConfigSync(name), 'use app.loadConfigSync');

    app.existsConfigSync = name => config.existsConfigSync(name);
    app.loadConfigSync = name => config.loadConfigSync(name);

    app.config = config;
    app.context.config = config;

    return config;
  };
}

exports.Config = Config;
exports.default = alpConfig;
//# sourceMappingURL=index-node8-dev.cjs.js.map
