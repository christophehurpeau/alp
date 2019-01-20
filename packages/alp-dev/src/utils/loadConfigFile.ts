import { readFileSync } from 'fs';
import path from 'path';
import { safeLoad as saveLoadYml } from 'js-yaml';

export type Config = { [key: string]: any };

export default function loadConfigFile(
  content: string,
  dirname: string,
): [Config, Config] {
  const data = saveLoadYml(content) || {};

  const config = data.shared || data.common || {};
  const serverConfig = { ...config, ...data.server };
  const browserConfig = { ...config, ...data.browser };

  if (data.include) {
    const includePaths = data.include.map((includePath: string) =>
      path.resolve(dirname, includePath),
    );
    includePaths
      .map((includePath: string) => readFileSync(includePath, 'utf-8'))
      .map((content: string, index: number) =>
        loadConfigFile(content, path.dirname(includePaths[index])),
      )
      .forEach(
        ([includeServerConfig, includeBrowserConfig]: [Config, Config]) => {
          [
            { config: serverConfig, include: includeServerConfig },
            { config: browserConfig, include: includeBrowserConfig },
          ].forEach(({ config, include }) =>
            Object.keys(include).forEach((key) => {
              if (!(key in config)) {
                config[key] = include[key];
                return;
              }
              if (Array.isArray(config[key])) {
                config[key].push(include[key]);
              } else if (typeof config[key] === 'object') {
                Object.assign(config[key], include[key]);
              } else {
                throw new TypeError(
                  `Unexpected override "${key}", filename = ${
                    includePaths[key]
                  }`,
                );
              }
            }),
          );
        },
      );
  }

  return [serverConfig, browserConfig];
}
