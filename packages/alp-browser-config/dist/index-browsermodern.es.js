import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import stringify from 'stringify-json';

const LOCAL_STORAGE_NAME = 'alp-browser-config';

const map = (() => {
  const config = localStorage.getItem(LOCAL_STORAGE_NAME);

  if (config === null) {
    return new Map();
  }

  return parseJSON(config);
})();

map.forEach(value => deepFreeze(value));
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

const ExcludesFalsy = Boolean;

function fetchConfig(path) {
  return fetch(`${path}.json`).then(res => res.text()).then(text => text.startsWith('{') ? parseJSON(text) : new Map());
}

function getConfig(path) {
  if (has(path)) {
    return Promise.resolve(get(path));
  }

  return fetchConfig(path).then(result => {
    deepFreeze(result);
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

const getOrFetchAppConfig = function (version, environment, configPath) {
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
    return deepFreeze(config);
  });
};

async function alpConfig(app, configPath) {
  const version = app.appVersion;

  if (!version) {
    throw new Error('Missing appVersion');
  }

  const config = await getOrFetchAppConfig(version, (process.env.NODE_ENV !== "production") ? 'development' : 'production', configPath);
  app.config = config;
  app.context.config = config;
  return config;
}

export { alpConfig as default, existsConfig, getConfig };
//# sourceMappingURL=index-browsermodern.es.js.map
