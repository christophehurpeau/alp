'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _regeneratorRuntime = require('../../../node_modules/@babel/runtime/regenerator/index.js');
var _asyncToGenerator = require('../../../node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js');
var deepFreeze = require('deep-freeze-es6');
var parseJSON = require('parse-json-object-as-map');
var stringify = require('stringify-json');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var deepFreeze__default = /*#__PURE__*/_interopDefaultLegacy(deepFreeze);
var parseJSON__default = /*#__PURE__*/_interopDefaultLegacy(parseJSON);
var stringify__default = /*#__PURE__*/_interopDefaultLegacy(stringify);

const LOCAL_STORAGE_NAME = 'alp-browser-config';

const map = (() => {
  const config = localStorage.getItem(LOCAL_STORAGE_NAME);

  if (config === null) {
    return new Map();
  }

  return parseJSON__default(config);
})();

map.forEach(value => deepFreeze__default(value));
function getVersion() {
  return map.get('version');
}
function has(key) {
  return map.has(key);
}
function get(key) {
  return map.get(key);
}
function save() {
  localStorage.setItem(LOCAL_STORAGE_NAME, stringify__default(map));
}
function set(key, value) {
  map.set(key, value);
  save();
}
function clear(version) {
  map.clear();
  map.set('version', version);
  save();
}

const ExcludesFalsy = Boolean;

function fetchConfig(path) {
  return fetch(`${path}.json`).then(res => res.text()).then(text => text.startsWith('{') ? parseJSON__default(text) : new Map());
}

function getConfig(path) {
  if (has(path)) {
    return Promise.resolve(get(path));
  }

  return fetchConfig(path).then(result => {
    deepFreeze__default(result);
    set(path, result);
    return result;
  });
}
function existsConfig(path) {
  if (has(path)) {
    return get(path) !== false;
  }

  return fetchConfig(path).then(result => result !== undefined);
}

const getOrFetchAppConfig = function getOrFetchAppConfig(version, environment, configPath) {
  if (getVersion() === version && has('_appConfig')) {
    return Promise.resolve(get('_appConfig'));
  }

  clear(version);
  return Promise.all([fetchConfig(`${configPath}/common`), environment ? fetchConfig(`${configPath}/${environment}`) : undefined, fetchConfig(`${configPath}/local`)]).then(([config, ...others]) => {
    if (!config) config = new Map();
    config.set('version', version);
    others.filter(ExcludesFalsy).forEach(jsonConfig => {
      jsonConfig.forEach((value, key) => config.set(key, value));
    });
    set('_appConfig', config);
    return deepFreeze__default(config);
  });
};

function alpConfig() {
  return _alpConfig.apply(this, arguments);
}

function _alpConfig() {
  _alpConfig = _asyncToGenerator__default( /*#__PURE__*/_regeneratorRuntime__default.mark(function _callee(app, configPath) {
    var version, config;
    return _regeneratorRuntime__default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          version = app.appVersion;

          if (version) {
            _context.next = 3;
            break;
          }

          throw new Error('Missing appVersion');

        case 3:
          _context.next = 5;
          return getOrFetchAppConfig(version, "production", configPath);

        case 5:
          config = _context.sent;
          app.config = config;
          app.context.config = config;
          return _context.abrupt("return", config);

        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _alpConfig.apply(this, arguments);
}

exports.default = alpConfig;
exports.existsConfig = existsConfig;
exports.getConfig = getConfig;
//# sourceMappingURL=index-browser.cjs.js.map
