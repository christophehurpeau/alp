/* global fetch */
import parseJSON from 'parse-json-object-as-map';
import * as storedConfig from './browserStoredConfig';

function fetchConfig(path) {
  return fetch(`${path}.json`).then(function (res) {
    return res.text();
  }).then(function (text) {
    return parseJSON(text);
  }).catch(function () {
    return false;
  });
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

const getOrFetchAppConfig = function getOrFetchAppConfig(version, environment, configPath) {
  return storedConfig.getVersion() === version && storedConfig.has('_appConfig') ? Promise.resolve(storedConfig.get('_appConfig')) : (storedConfig.clear(version), Promise.all([getConfig(`${configPath}common`), environment && getConfig(`${configPath}environment`), getConfig(`${configPath}local`)]).then(function ([config, ...others]) {

    return config || (config = new Map()), config.set('version', version), others.filter(Boolean).forEach(function (jsonConfig) {
      jsonConfig.forEach(function (value, key) {
        return config.set(key, value);
      });
    }), storedConfig.set('_appConfig', config), config;
  }));
};

export default function alpConfig(configPath) {
  return configPath = configPath.replace(/\/*$/, '/'), function (app) {
    app.existsConfig = function (name) {
      return existsConfig(`${configPath}${name}`);
    }, app.loadConfig = function (name) {
      return getConfig(`${configPath}${name}`);
    };


    const version = app.appVersion;

    if (!version) throw new Error('Missing appVersion');

    return getOrFetchAppConfig(version, app.environment, configPath).then(function (config) {
      return app.config = config, app.context.config = config, config;
    });
  };
}
//# sourceMappingURL=browser.js.map