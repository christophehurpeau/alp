import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import stringify from 'stringify-json';

/* global localStorage */

var map = function () {
  var config = localStorage.getItem('ibex-config');
  if (config === null) {
    return new Map();
  }

  return parseJSON(config);
}();

map.forEach(function (value) {
  return deepFreeze(value);
});

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
  localStorage.setItem('ibex-config', stringify(map));
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

var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

/* global fetch */

function fetchConfig(path) {
  return fetch(path + '.json').then(function (res) {
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
  if (has(path)) {
    return get(path);
  }
  return fetchConfig(path);
}

/**
 * @param {string} path
 * @returns {Promise|Boolean}
 */
function existsConfig(path) {
  if (has(path)) {
    return get(path) !== false;
  }
  return fetchConfig(path);
}

var getOrFetchAppConfig = function getOrFetchAppConfig(version, environment, configPath) {
  if (getVersion() === version && has('_appConfig')) {
    return Promise.resolve(get('_appConfig'));
  }

  clear(version);

  return Promise.all([getConfig(configPath + 'common'), environment && getConfig(configPath + 'environment'), getConfig(configPath + 'local')]).then(function (_ref) {
    var _ref2 = toArray(_ref),
        config = _ref2[0],
        others = _ref2.slice(1);

    if (!config) config = new Map();
    config.set('version', version);

    others.filter(Boolean).forEach(function (jsonConfig) {
      jsonConfig.forEach(function (value, key) {
        return config.set(key, value);
      });
    });

    set('_appConfig', config);

    return config;
  });
};

function alpConfig(configPath) {
  configPath = configPath.replace(/\/*$/, '/');
  return function (app) {
    app.existsConfig = function (name) {
      return existsConfig('' + configPath + name);
    };
    app.loadConfig = function (name) {
      return getConfig('' + configPath + name);
    };

    var version = app.appVersion;

    if (!version) {
      throw new Error('Missing appVersion');
    }

    return getOrFetchAppConfig(version, app.environment, configPath).then(function (config) {
      app.config = config;
      app.context.config = config;
      return config;
    });
  };
}

export default alpConfig;
//# sourceMappingURL=index-browser.es.js.map
