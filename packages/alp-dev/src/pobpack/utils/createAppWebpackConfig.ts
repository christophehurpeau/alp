import { existsSync } from 'fs';
import { resolve } from 'path';
import type { Options, FilledWebpackConfiguration } from '../types';
import createOptions from './createOptions';

export type CreateWebpackConfig = (
  options: Options,
) => FilledWebpackConfiguration;

export type CreateWebpackConfigPartialOptions = (
  options: Partial<Options>,
) => FilledWebpackConfiguration;

export type AppWebpackConfigCreator = (
  createWebpackConfig: CreateWebpackConfigPartialOptions,
  options: Partial<Options>,
) => FilledWebpackConfiguration;

export function createAppWebpackConfig(
  createWebpackConfig: CreateWebpackConfig,
): CreateWebpackConfigPartialOptions {
  const wrapCreateWebpackConfig: CreateWebpackConfigPartialOptions = (
    options,
  ) => createWebpackConfig(createOptions(options));

  return (options: Partial<Options>): FilledWebpackConfiguration => {
    const appWebpackConfigPath = resolve('createAppWebpackConfig.js');
    if (existsSync(appWebpackConfigPath)) {
      throw new Error('createAppWebpackConfig.js is no longer supported');
      // console.info('Using app createAppWebpackConfig.js');
      // // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
      // const appWebpackConfigCreator: AppWebpackConfigCreator = require(appWebpackConfigPath);
      // if (typeof appWebpackConfigCreator !== 'function') {
      //   console.error(
      //     'app createAppWebpackConfig.js should export a function\n' +
      //       'module.exports = function (config, options) { ... }',
      //   );
      // }

      // options = createOptions(options);
      // const config = appWebpackConfigCreator(wrapCreateWebpackConfig, options);

      // if (typeof config !== 'object') {
      //   console.error(
      //     'app createAppWebpackConfig.js should return the config\n' +
      //       'function (config, options) { return config(options); }',
      //   );
      // }

      // return config;
    } else {
      return wrapCreateWebpackConfig(options);
    }
  };
}
