var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import _t from 'tcomb-forked';
import { deprecate } from 'util';
import argv from 'minimist-argv';
import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import { existsSync, readFileSync } from 'fs';

function _existsConfigSync(dirname, name) {
  _assert(dirname, _t.String, 'dirname');

  _assert(name, _t.String, 'name');

  return existsSync(`${ dirname }${ name }.json`);
}

function _loadConfigSync(dirname, name) {
  _assert(dirname, _t.String, 'dirname');

  _assert(name, _t.String, 'name');

  var content = readFileSync(`${ dirname }${ name }.json`);
  return parseJSON(content);
}

var ConfigOptions = _t.interface({
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

  loadSync() {
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
      for (var _ref of this.loadConfigSync(env)) {
        var _ref2 = _slicedToArray(_ref, 2);

        var key = _ref2[0];
        var value = _ref2[1];

        config.set(key, value);
      }

      if (this.existsConfigSync('local')) {
        // eslint-disable-next-line no-restricted-syntax
        for (var _ref3 of this.loadConfigSync('local')) {
          var _ref4 = _slicedToArray(_ref3, 2);

          var _key = _ref4[0];
          var _value = _ref4[1];

          config.set(_key, _value);
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

      argvOverrides.forEach(key => {
        var splitted = key.split('.');
        var value = splitted.length !== 0 && splitted.reduce((config, partialKey) => config && config[partialKey], argv);
        if (value !== undefined) {
          var last = splitted.pop();
          var map = splitted.length === 0 ? config : splitted.reduce((config, partialKey) => config.get(partialKey), config);
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

    app.existsConfig = deprecate(name => config.existsConfigSync(name), 'use app.existsConfigSync');
    app.loadConfig = deprecate(name => config.loadConfigSync(name), 'use app.loadConfigSync');

    app.existsConfigSync = name => config.existsConfigSync(name);
    app.loadConfigSync = name => config.loadConfigSync(name);

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