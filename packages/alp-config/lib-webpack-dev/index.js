var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from 'tcomb-forked';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { deprecate } from 'util';
import argv from 'minimist-argv';
import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import { existsSync, readFileSync } from 'fs';

function _existsConfigSync(dirname, name) {
  _assert(dirname, _t.String, 'dirname');

  _assert(name, _t.String, 'name');

  return existsSync('' + dirname + name + '.json');
}

function _loadConfigSync(dirname, name) {
  _assert(dirname, _t.String, 'dirname');

  _assert(name, _t.String, 'name');

  var content = readFileSync('' + dirname + name + '.json');
  return parseJSON(content);
}

var ConfigOptions = _t.interface({
  argv: _t.maybe(_t.list(_t.String)),
  packageConfig: _t.maybe(_t.Object),
  version: _t.maybe(_t.String)
}, 'ConfigOptions');

export var Config = function () {
  function Config(dirname) {
    _assert(dirname, _t.String, 'dirname');

    _classCallCheck(this, Config);

    this._map = new Map();
    this._dirname = dirname.replace(/\/*$/, '/');
  }

  _createClass(Config, [{
    key: 'loadSync',
    value: function loadSync() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _assert(options, ConfigOptions, 'options');

      return _assert(function () {
        var env = process.env.CONFIG_ENV || process.env.NODE_ENV || 'development';
        var _options$argv = options.argv,
            argvOverrides = _options$argv === undefined ? [] : _options$argv,
            packageConfig = options.packageConfig,
            version = options.version;

        this.packageConfig = packageConfig;

        var config = this.loadConfigSync('common');
        // eslint-disable-next-line no-restricted-syntax
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.loadConfigSync(env)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                key = _step$value[0],
                value = _step$value[1];

            config.set(key, value);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (this.existsConfigSync('local')) {
          // eslint-disable-next-line no-restricted-syntax
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this.loadConfigSync('local')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _step2$value = _slicedToArray(_step2.value, 2),
                  key = _step2$value[0],
                  value = _step2$value[1];

              config.set(key, value);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        if (config.has('version')) {
          throw new Error('Cannot have "version", in config.');
        }

        config.set('version', version || argv.version || packageConfig.version);

        var socketPath = argv['socket-path'] || argv.socketPath;
        if (socketPath) {
          config.set('socketPath', socketPath);
        } else if (argv.port) {
          config.set('port', argv.port);
          config.delete('socketPath');
        }

        argvOverrides.forEach(function (key) {
          var splitted = key.split('.');
          var value = splitted.length !== 0 && splitted.reduce(function (config, partialKey) {
            return config && config[partialKey];
          }, argv);
          if (value !== undefined) {
            var last = splitted.pop();
            var map = splitted.length === 0 ? config : splitted.reduce(function (config, partialKey) {
              return config.get(partialKey);
            }, config);
            map.set(last, value);
          }
        });

        return this._map = deepFreeze(config);
      }.apply(this, arguments), Map, 'return value');
    }
  }, {
    key: 'get',
    value: function get(key) {
      _assert(key, _t.String, 'key');

      return _assert(function () {
        return this._map.get(key);
      }.apply(this, arguments), _t.Any, 'return value');
    }
  }, {
    key: 'existsConfigSync',
    value: function existsConfigSync(name) {
      _assert(name, _t.String, 'name');

      return _assert(function () {
        return _existsConfigSync(this._dirname, name);
      }.apply(this, arguments), _t.Boolean, 'return value');
    }
  }, {
    key: 'loadConfigSync',
    value: function loadConfigSync(name) {
      _assert(name, _t.String, 'name');

      return _assert(function () {
        return _loadConfigSync(this._dirname, name);
      }.apply(this, arguments), Map, 'return value');
    }
  }]);

  return Config;
}();

export default function alpConfig(dirname) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
  }.bind(this);
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map