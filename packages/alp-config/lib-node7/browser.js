'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alpConfig;

var _parseJsonObjectAsMap = require('parse-json-object-as-map');

var _parseJsonObjectAsMap2 = _interopRequireDefault(_parseJsonObjectAsMap);

var _browserStoredConfig = require('./browserStoredConfig');

var storedConfig = _interopRequireWildcard(_browserStoredConfig);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global fetch */
function fetchConfig(path) {
  return fetch(`${path}.json`).then(res => res.text()).then(text => (0, _parseJsonObjectAsMap2.default)(text)).catch(() => false);
}

/**
 * @param {string} path
 * @returns {Promise|Map}
 */
function getConfig(path) {
  if (storedConfig.has(path)) {
    return storedConfig.get(path);
  }
  return fetchConfig(path);
}

/**
 * @param {string} path
 * @returns {Promise|Boolean}
 */
function existsConfig(path) {
  if (storedConfig.has(path)) {
    return storedConfig.get(path) !== false;
  }
  return fetchConfig(path);
}

const getOrFetchAppConfig = function (version, environment, configPath) {
  if (storedConfig.getVersion() === version && storedConfig.has('_appConfig')) {
    return Promise.resolve(storedConfig.get('_appConfig'));
  }

  storedConfig.clear(version);

  return Promise.all([getConfig(`${configPath}common`), environment && getConfig(`${configPath}environment`), getConfig(`${configPath}local`)]).then(([config, ...others]) => {
    if (!config) config = new Map();
    config.set('version', version);

    others.filter(Boolean).forEach(jsonConfig => {
      jsonConfig.forEach((value, key) => config.set(key, value));
    });

    storedConfig.set('_appConfig', config);

    return config;
  });
};

function alpConfig(configPath) {
  configPath = configPath.replace(/\/*$/, '/');
  return function (app) {
    app.existsConfig = name => existsConfig(`${configPath}${name}`);
    app.loadConfig = name => getConfig(`${configPath}${name}`);

    const version = app.appVersion;

    if (!version) {
      throw new Error('Missing appVersion');
    }

    return getOrFetchAppConfig(version, app.environment, configPath).then(config => {
      app.config = config;
      app.context.config = config;
      return config;
    });
  };
}
//# sourceMappingURL=browser.js.map