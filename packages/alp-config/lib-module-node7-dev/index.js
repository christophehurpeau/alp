var _dec, _dec2, _dec3, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['defineProperty'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { deprecate } from 'util';
import argv from 'minimist-argv';
import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import { existsSync, readFileSync } from 'fs';

import t from 'flow-runtime';
function _existsConfigSync(dirname, name) {
  let _dirnameType = t.string();

  let _nameType = t.string();

  t.param('dirname', _dirnameType).assert(dirname);
  t.param('name', _nameType).assert(name);

  return existsSync(`${dirname}${name}.json`);
}

function _loadConfigSync(dirname, name) {
  let _dirnameType2 = t.string();

  let _nameType2 = t.string();

  t.param('dirname', _dirnameType2).assert(dirname);
  t.param('name', _nameType2).assert(name);

  let content = readFileSync(`${dirname}${name}.json`);
  return parseJSON(content);
}

const ConfigOptions = t.type('ConfigOptions', t.exactObject(t.property('argv', t.nullable(t.array(t.string()))), t.property('packageConfig', t.nullable(t.object())), t.property('version', t.nullable(t.string()))));


export let Config = (_dec = t.decorate(t.ref('Map', t.string(), t.any())), _dec2 = t.decorate(t.string()), _dec3 = t.decorate(t.object()), (_class = class {

  constructor(dirname) {
    _initDefineProp(this, '_map', _descriptor, this);

    _initDefineProp(this, '_dirname', _descriptor2, this);

    _initDefineProp(this, 'packageConfig', _descriptor3, this);

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

    argvOverrides.forEach(key => {
      const splitted = key.split('.');
      const value = splitted.length !== 0 && splitted.reduce((config, partialKey) => config && config[partialKey], argv);
      if (value !== undefined) {
        const last = splitted.pop();
        const map = splitted.length === 0 ? config : splitted.reduce((config, partialKey) => config.get(partialKey), config);
        map.set(last, value);
      }
    });

    return _returnType.assert(this._map = deepFreeze(config));
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
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, '_map', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, '_dirname', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'packageConfig', [_dec3], {
  enumerable: true,
  initializer: null
})), _class));

export default function alpConfig(dirname, options = {}) {
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

    app.existsConfig = deprecate(name => config.existsConfigSync(name), 'use app.existsConfigSync');
    app.loadConfig = deprecate(name => config.loadConfigSync(name), 'use app.loadConfigSync');

    app.existsConfigSync = name => config.existsConfigSync(name);
    app.loadConfigSync = name => config.loadConfigSync(name);

    app.config = config;
    app.context.config = config;

    return config;
  };
}
//# sourceMappingURL=index.js.map