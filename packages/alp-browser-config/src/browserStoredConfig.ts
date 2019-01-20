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

map.forEach((value: any) => deepFreeze(value));

export function getVersion() {
  return map.get('version');
}

export function has(key: string) {
  return map.has(key);
}

export function get(key: string) {
  return map.get(key);
}

export function save() {
  localStorage.setItem(LOCAL_STORAGE_NAME, stringify(map));
}

export function set(key: string, value: any) {
  map.set(key, value);
  save();
}

export function clear(version: string) {
  map.clear();
  map.set('version', version);
  save();
}
