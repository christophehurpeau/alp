import { POB_ENV } from 'pob-babel';
import type { BrowserApplicationInCreation, Config } from 'alp-types';
import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import * as storedConfig from './browserStoredConfig';

type RawConfig = Map<string, unknown>;

const ExcludesFalsy = (Boolean as unknown) as <T>(
  x: T | boolean | null | undefined,
) => x is T;

function fetchConfig(path: string): Promise<RawConfig> {
  return fetch(`${path}.json`)
    .then((res) => res.text())
    .then((text) =>
      text.startsWith('{')
        ? (parseJSON(text) as RawConfig)
        : new Map<string, unknown>(),
    );
}

export function getConfig(path: string): Promise<RawConfig> {
  if (storedConfig.has(path)) {
    return Promise.resolve(storedConfig.get(path));
  }

  return fetchConfig(path).then((result: RawConfig) => {
    deepFreeze(result);
    storedConfig.set(path, result);
    return result;
  });
}

export function existsConfig(path: string): Promise<boolean> | boolean {
  if (storedConfig.has(path)) {
    return storedConfig.get(path) !== false;
  }
  return fetchConfig(path).then((result) => result !== undefined);
}

const getOrFetchAppConfig = function (
  version: string,
  environment: string,
  configPath: string,
): Promise<RawConfig> {
  if (storedConfig.getVersion() === version && storedConfig.has('_appConfig')) {
    return Promise.resolve(storedConfig.get('_appConfig'));
  }

  storedConfig.clear(version);

  return Promise.all([
    fetchConfig(`${configPath}/common`),
    environment ? fetchConfig(`${configPath}/${environment}`) : undefined,
    fetchConfig(`${configPath}/local`),
  ] as (Promise<RawConfig | undefined> | undefined)[]).then(
    ([config, ...others]: [...(RawConfig | undefined)[]]) => {
      if (!config) config = new Map();
      config.set('version', version);

      others.filter(ExcludesFalsy).forEach((jsonConfig) => {
        jsonConfig.forEach((value: any, key: string) =>
          (config as RawConfig).set(key, value),
        );
      });

      storedConfig.set('_appConfig', config);
      return deepFreeze(config);
    },
  );
};

export default async function alpConfig(
  app: BrowserApplicationInCreation,
  configPath: string,
): Promise<Config> {
  const version = app.appVersion;

  if (!version) {
    throw new Error('Missing appVersion');
  }

  const config: Config = (await getOrFetchAppConfig(
    version,
    POB_ENV,
    configPath,
  )) as Config;
  app.config = config;
  app.context.config = config;
  return config;
}
