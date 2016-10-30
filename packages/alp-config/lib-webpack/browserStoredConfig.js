/* global localStorage */
import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import stringify from 'stringify-json';

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

export function getVersion() {
  return map.get('version');
}

export function has(key) {
  return map.has(key);
}

export function get(key) {
  return map.get(key);
}

export function save() {
  localStorage.setItem('ibex-config', stringify(map));
}

export function set(key, value) {
  map.set(key, value);
  save();
}

export function clear(version) {
  map.clear();
  map.set('version', version);
  save();
}
//# sourceMappingURL=browserStoredConfig.js.map