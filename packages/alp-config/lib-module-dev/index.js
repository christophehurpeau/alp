var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = void 0; try { for (var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !(i && _arr.length === i)); _n = true); } catch (err) { _d = true, _e = err; } finally { try { !_n && _i["return"] && _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) return arr; if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i); throw new TypeError("Invalid attempt to destructure non-iterable instance"); }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

var _dec, _dec2, _dec3, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

function _initDefineProp(target, property, descriptor, context) {
  descriptor && Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  return Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  }), desc.enumerable = !!desc.enumerable, desc.configurable = !!desc.configurable, ('value' in desc || desc.initializer) && (desc.writable = true), desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc), context && desc.initializer !== void 0 && (desc.value = desc.initializer ? desc.initializer.call(context) : void 0, desc.initializer = void 0), desc.initializer === void 0 && (Object['defineProperty'](target, property, desc), desc = null), desc;
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
  var _dirnameType = t.string();

  var _nameType = t.string();

  return t.param('dirname', _dirnameType).assert(dirname), t.param('name', _nameType).assert(name), existsSync('' + dirname + name + '.json');
}

function _loadConfigSync(dirname, name) {
  var _dirnameType2 = t.string();

  var _nameType2 = t.string();

  t.param('dirname', _dirnameType2).assert(dirname), t.param('name', _nameType2).assert(name);

  var content = readFileSync('' + dirname + name + '.json');
  return parseJSON(content);
}

var ConfigOptions = t.type('ConfigOptions', t.exactObject(t.property('argv', t.nullable(t.array(t.string()))), t.property('packageConfig', t.nullable(t.object())), t.property('version', t.nullable(t.string()))));


export var Config = (_dec = t.decorate(t.ref('Map', t.string(), t.any())), _dec2 = t.decorate(t.string()), _dec3 = t.decorate(t.object()), _class = function () {
  function Config(dirname) {
    _classCallCheck(this, Config), _initDefineProp(this, '_map', _descriptor, this), _initDefineProp(this, '_dirname', _descriptor2, this), _initDefineProp(this, 'packageConfig', _descriptor3, this);

    var _dirnameType3 = t.string();

    t.param('dirname', _dirnameType3).assert(dirname), this._map = new Map(), this._dirname = dirname.replace(/\/*$/, '/');
  }

  return _createClass(Config, [{
    key: 'loadSync',
    value: function loadSync() {
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};

      var _returnType = t.return(t.ref('Map', t.string(), t.any()));

      t.param('options', ConfigOptions).assert(options);

      var env = process.env.CONFIG_ENV || process.env.NODE_ENV || 'development';
      var _options$argv = options.argv,
          argvOverrides = _options$argv === void 0 ? [] : _options$argv,
          packageConfig = options.packageConfig,
          version = options.version;
      this.packageConfig = packageConfig;


      var config = this.loadConfigSync('common');
      // eslint-disable-next-line no-restricted-syntax
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;

      var _iteratorError = void 0;

      try {
        for (var _step, _iterator = this.loadConfigSync(env)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref = _step.value;

          var _ref2 = _slicedToArray(_ref, 2);

          var key = _ref2[0];
          var value = _ref2[1];
          config.set(key, value);
        }
      } catch (err) {
        _didIteratorError = true, _iteratorError = err;
      } finally {
        try {
          !_iteratorNormalCompletion && _iterator.return && _iterator.return();
        } finally {
          if (_didIteratorError) throw _iteratorError;
        }
      }

      if (this.existsConfigSync('local')) {
        // eslint-disable-next-line no-restricted-syntax
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;

        var _iteratorError2 = void 0;

        try {
          for (var _step2, _iterator2 = this.loadConfigSync('local')[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _ref3 = _step2.value;

            var _ref4 = _slicedToArray(_ref3, 2);

            var _key = _ref4[0];
            var _value2 = _ref4[1];
            config.set(_key, _value2);
          }
        } catch (err) {
          _didIteratorError2 = true, _iteratorError2 = err;
        } finally {
          try {
            !_iteratorNormalCompletion2 && _iterator2.return && _iterator2.return();
          } finally {
            if (_didIteratorError2) throw _iteratorError2;
          }
        }
      }

      if (config.has('version')) throw new Error('Cannot have "version", in config.');

      config.set('version', version || argv.version || packageConfig.version);


      var socketPath = argv['socket-path'] || argv.socketPath;


      return socketPath ? config.set('socketPath', socketPath) : argv.port ? (config.set('port', argv.port), config.delete('socketPath')) : process.env.PORT && (config.set('port', Number(process.env.PORT)), config.delete('socketPath')), argvOverrides.forEach(function (key) {
        var splitted = key.split('.');
        var value = splitted.length !== 0 && splitted.reduce(function (config, partialKey) {
          return config && config[partialKey];
        }, argv);
        if (value !== void 0) {
          var last = splitted.pop();
          var map = splitted.length === 0 ? config : splitted.reduce(function (config, partialKey) {
            return config.get(partialKey);
          }, config);
          map.set(last, value);
        }
      }), _returnType.assert(this._map = deepFreeze(config));
    }
  }, {
    key: 'get',
    value: function get(key) {
      var _keyType = t.string();

      var _returnType2 = t.return(t.any());

      return t.param('key', _keyType).assert(key), _returnType2.assert(this._map.get(key));
    }
  }, {
    key: 'existsConfigSync',
    value: function existsConfigSync(name) {
      var _nameType3 = t.string();

      var _returnType3 = t.return(t.boolean());

      return t.param('name', _nameType3).assert(name), _returnType3.assert(_existsConfigSync(this._dirname, name));
    }
  }, {
    key: 'loadConfigSync',
    value: function loadConfigSync(name) {
      var _nameType4 = t.string();

      var _returnType4 = t.return(t.ref('Map', t.string(), t.any()));

      return t.param('name', _nameType4).assert(name), _returnType4.assert(_loadConfigSync(this._dirname, name));
    }
  }]), Config;
}(), _descriptor = _applyDecoratedDescriptor(_class.prototype, '_map', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, '_dirname', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'packageConfig', [_dec3], {
  enumerable: true,
  initializer: null
}), _class);

export default function alpConfig(dirname) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};

  var _dirnameType4 = t.nullable(t.string());

  return t.param('dirname', _dirnameType4).assert(dirname), t.param('options', ConfigOptions).assert(options), function (app, config) {
    var _configType = t.nullable(t.ref(Config));

    return t.param('config', _configType).assert(config), config || (config = _configType.assert(new Config(dirname)), config.loadSync(options)), app.existsConfig = deprecate(function (name) {
      return config.existsConfigSync(name);
    }, 'use app.existsConfigSync'), app.loadConfig = deprecate(function (name) {
      return config.loadConfigSync(name);
    }, 'use app.loadConfigSync'), app.existsConfigSync = function (name) {
      return config.existsConfigSync(name);
    }, app.loadConfigSync = function (name) {
      return config.loadConfigSync(name);
    }, app.config = config, app.context.config = config, config;
  };
}
//# sourceMappingURL=index.js.map