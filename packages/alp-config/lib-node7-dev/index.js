'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = undefined;

var _dec, _dec2, _dec3, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

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

const ConfigOptions = _flowRuntime2.default.type('ConfigOptions', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('argv', _flowRuntime2.default.nullable(_flowRuntime2.default.array(_flowRuntime2.default.string()))), _flowRuntime2.default.property('packageConfig', _flowRuntime2.default.nullable(_flowRuntime2.default.object())), _flowRuntime2.default.property('version', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))));

let Config = exports.Config = (_dec = _flowRuntime2.default.decorate(_flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.any())), _dec2 = _flowRuntime2.default.decorate(_flowRuntime2.default.string()), _dec3 = _flowRuntime2.default.decorate(_flowRuntime2.default.object()), (_class = class {

  constructor(dirname) {
    _initDefineProp(this, '_map', _descriptor, this);

    _initDefineProp(this, '_dirname', _descriptor2, this);

    _initDefineProp(this, 'packageConfig', _descriptor3, this);

    let _dirnameType3 = _flowRuntime2.default.string();

    _flowRuntime2.default.param('dirname', _dirnameType3).assert(dirname);

    this._map = new Map();
    this._dirname = dirname.replace(/\/*$/, '/');
  }

  loadSync(options = {}) {
    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.any()));

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

    const _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.any()));

    _flowRuntime2.default.param('name', _nameType4).assert(name);

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
function alpConfig(dirname, options = {}) {
  let _dirnameType4 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  _flowRuntime2.default.param('dirname', _dirnameType4).assert(dirname);

  _flowRuntime2.default.param('options', ConfigOptions).assert(options);

  return (app, config) => {
    let _configType = _flowRuntime2.default.nullable(_flowRuntime2.default.ref(Config));

    _flowRuntime2.default.param('config', _configType).assert(config);

    if (!config) {
      config = _configType.assert(new Config(dirname));
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