/* eslint-disable @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { readFileSync } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export type Config = Record<string, any>;

export default function loadConfigFile(
  content: string,
  dirname: string,
): [Config, Config] {
  const data: any = yaml.load(content) || {};

  const config = data.shared || data.common || {};
  const serverConfig = { ...config, ...data.server };
  const browserConfig = { ...config, ...data.browser };

  if (data.include) {
    const includePaths = data.include.map((includePath: string) =>
      path.resolve(dirname, includePath),
    );
    includePaths
      .map((includePath: string) => readFileSync(includePath, 'utf-8'))
      .map((fileContent: string, index: number) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        loadConfigFile(fileContent, path.dirname(includePaths[index])),
      )
      .forEach(
        ([includeServerConfig, includeBrowserConfig]: [Config, Config]) => {
          [
            { includeConfig: serverConfig, include: includeServerConfig },
            { includeConfig: browserConfig, include: includeBrowserConfig },
          ].forEach(({ includeConfig, include }) => {
            Object.keys(include).forEach((key) => {
              if (!(key in includeConfig)) {
                includeConfig[key] = include[key];
                return;
              }
              if (Array.isArray(includeConfig[key])) {
                includeConfig[key].push(include[key]);
              } else if (typeof includeConfig[key] === 'object') {
                Object.assign(includeConfig[key], include[key]);
              } else {
                throw new TypeError(
                  `Unexpected override "${key}", filename = ${includePaths[key]}`,
                );
              }
            });
          });
        },
      );
  }

  return [serverConfig as Config, browserConfig as Config];
}
