'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alpConfig;

var _parseJsonObjectAsMap = require('parse-json-object-as-map');

var _parseJsonObjectAsMap2 = _interopRequireDefault(_parseJsonObjectAsMap);

var _browserStoredConfig = require('./browserStoredConfig');

var storedConfig = _interopRequireWildcard(_browserStoredConfig);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) return obj; var newObj = {}; if (obj != null) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]); return newObj.default = obj, newObj; }

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
  return storedConfig.has(path) ? storedConfig.get(path) : fetchConfig(path);
}

/**
 * @param {string} path
 * @returns {Promise|Boolean}
 */
function existsConfig(path) {
  return storedConfig.has(path) ? storedConfig.get(path) !== false : fetchConfig(path);
}

const getOrFetchAppConfig = function (version, environment, configPath) {
  return storedConfig.getVersion() === version && storedConfig.has('_appConfig') ? Promise.resolve(storedConfig.get('_appConfig')) : (storedConfig.clear(version), Promise.all([getConfig(`${configPath}common`), environment && getConfig(`${configPath}environment`), getConfig(`${configPath}local`)]).then(([config, ...others]) => (config || (config = new Map()), config.set('version', version), others.filter(Boolean).forEach(jsonConfig => {
    jsonConfig.forEach((value, key) => config.set(key, value));
  }), storedConfig.set('_appConfig', config), config)));
};

function alpConfig(configPath) {
  return configPath = configPath.replace(/\/*$/, '/'), function (app) {
    app.existsConfig = name => existsConfig(`${configPath}${name}`), app.loadConfig = name => getConfig(`${configPath}${name}`);


    const version = app.appVersion;

    if (!version) throw new Error('Missing appVersion');

    return getOrFetchAppConfig(version, app.environment, configPath).then(config => (app.config = config, app.context.config = config, config));
  };
}
//# sourceMappingURL=browser.js.map