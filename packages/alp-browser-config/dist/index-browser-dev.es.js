import parseJSON from 'parse-json-object-as-map';
import deepFreeze from 'deep-freeze-es6';
import stringify from 'stringify-json';

var LOCAL_STORAGE_NAME = 'alp-browser-config';

var map = function () {
  var config = localStorage.getItem(LOCAL_STORAGE_NAME);

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
  localStorage.setItem(LOCAL_STORAGE_NAME, stringify(map));
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

var ExcludesFalsy = Boolean;

function fetchConfig(path) {
  return fetch(path + ".json").then(function (res) {
    return res.text();
  }).then(function (text) {
    return text.startsWith('{') ? parseJSON(text) : new Map();
  });
}

function getConfig(path) {
  if (has(path)) {
    return Promise.resolve(get(path));
  }

  return fetchConfig(path).then(function (result) {
    deepFreeze(result);
    set(path, result);
    return result;
  });
}
function existsConfig(path) {
  if (has(path)) {
    return get(path) !== false;
  }

  return fetchConfig(path).then(function (result) {
    return result !== undefined;
  });
}

var getOrFetchAppConfig = function getOrFetchAppConfig(version, environment, configPath) {
  if (getVersion() === version && has('_appConfig')) {
    return Promise.resolve(get('_appConfig'));
  }

  clear(version);
  return Promise.all([fetchConfig(configPath + "/common"), environment ? fetchConfig(configPath + "/" + environment) : undefined, fetchConfig(configPath + "/local")]).then(function (_ref) {
    var config = _ref[0],
        others = _ref.slice(1);

    if (!config) config = new Map();
    config.set('version', version);
    others.filter(ExcludesFalsy).forEach(function (jsonConfig) {
      jsonConfig.forEach(function (value, key) {
        return config.set(key, value);
      });
    });
    set('_appConfig', config);
    return deepFreeze(config);
  });
};

function alpConfig(app, configPath) {
  var version = app.appVersion;

  if (!version) {
    throw new Error('Missing appVersion');
  }

  return getOrFetchAppConfig(version, "development", configPath).then(function (config) {
    app.config = config;
    app.context.config = config;
    return config;
  });
}

export default alpConfig;
export { existsConfig, getConfig };
//# sourceMappingURL=index-browser-dev.es.js.map
