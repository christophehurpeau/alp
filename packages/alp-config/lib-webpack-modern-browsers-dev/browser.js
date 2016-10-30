function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/* global fetch */
import parseJSON from 'parse-json-object-as-map';
import * as storedConfig from './browserStoredConfig';

function fetchConfig(path) {
  return fetch(`${ path }.json`).then(res => res.text()).then(text => parseJSON(text)).catch(() => false);
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

var getOrFetchAppConfig = function getOrFetchAppConfig(version, environment, configPath) {
  if (storedConfig.getVersion() === version && storedConfig.has('_appConfig')) {
    return Promise.resolve(storedConfig.get('_appConfig'));
  }

  storedConfig.clear(version);

  return Promise.all([getConfig(`${ configPath }common`), environment && getConfig(`${ configPath }environment`), getConfig(`${ configPath }local`)]).then((_ref) => {
    var _ref2 = _toArray(_ref),
        config = _ref2[0],
        others = _ref2.slice(1);

    if (!config) config = new Map();
    config.set('version', version);

    others.filter(Boolean).forEach(jsonConfig => {
      jsonConfig.forEach((value, key) => config.set(key, value));
    });

    storedConfig.set('_appConfig', config);

    return config;
  });
};

export default function alpConfig(configPath) {
  configPath = configPath.replace(/\/*$/, '/');
  return function (app) {
    app.existsConfig = name => existsConfig(`${ configPath }${ name }`);
    app.loadConfig = name => getConfig(`${ configPath }${ name }`);

    var version = app.appVersion;

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