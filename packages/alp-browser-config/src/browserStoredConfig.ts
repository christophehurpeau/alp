import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import stringify from 'stringify-json';

const LOCAL_STORAGE_NAME = 'alp-browser-config';

const map: Map<string, unknown> = (() => {
  const config = localStorage.getItem(LOCAL_STORAGE_NAME);
  if (config === null) {
    return new Map<string, unknown>();
  }

  return parseJSON(config) as Map<string, unknown>;
})();

map.forEach((value: unknown) => deepFreeze(value));

export function getVersion(): string | undefined {
  return map.get('version') as string;
}

export function has(key: string): boolean {
  return map.has(key);
}

export function get<T = unknown>(key: string): T {
  return map.get(key) as T;
}

export function save(): void {
  localStorage.setItem(LOCAL_STORAGE_NAME, stringify(map));
}

export function set(key: string, value: unknown): void {
  map.set(key, value);
  save();
}

export function clear(version: string): void {
  map.clear();
  map.set('version', version);
  save();
}
