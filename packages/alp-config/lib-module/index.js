var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = void 0; try { for (var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !(i && _arr.length === i)); _n = true); } catch (err) { _d = true, _e = err; } finally { try { !_n && _i["return"] && _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) return arr; if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i); throw new TypeError("Invalid attempt to destructure non-iterable instance"); }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

import { deprecate } from 'util';
import argv from 'minimist-argv';
import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import { existsSync, readFileSync } from 'fs';

function _existsConfigSync(dirname, name) {
  return existsSync('' + dirname + name + '.json');
}

function _loadConfigSync(dirname, name) {
  var content = readFileSync('' + dirname + name + '.json');
  return parseJSON(content);
}

export var Config = function () {
  function Config(dirname) {
    _classCallCheck(this, Config), this._map = new Map(), this._dirname = dirname.replace(/\/*$/, '/');
  }

  return _createClass(Config, [{
    key: 'loadSync',
    value: function loadSync() {
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};

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
            var _value = _ref4[1];
            config.set(_key, _value);
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
      }), this._map = deepFreeze(config);
    }
  }, {
    key: 'get',
    value: function get(key) {
      return this._map.get(key);
    }
  }, {
    key: 'existsConfigSync',
    value: function existsConfigSync(name) {
      return _existsConfigSync(this._dirname, name);
    }
  }, {
    key: 'loadConfigSync',
    value: function loadConfigSync(name) {
      return _loadConfigSync(this._dirname, name);
    }
  }]), Config;
}();

export default function alpConfig(dirname) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};

  return function (app, config) {

    return config || (config = new Config(dirname), config.loadSync(options)), app.existsConfig = deprecate(function (name) {
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