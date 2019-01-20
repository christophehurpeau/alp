import path from 'path';
import {
  createAppBrowserCompiler,
  MODERN,
  ALL,
  runDevServer as runDevServerPobpack,
  RunOptions,
} from 'pobpack-browser';
import { PobpackCompiler } from 'pobpack-types';
import createPobpackConfig from './createPobpackConfig';

export const createModernBrowserCompiler = (production: boolean) =>
  createAppBrowserCompiler(
    MODERN,
    createPobpackConfig('modern-browser', production),
  );

export const createOlderBrowserCompiler = (production: boolean) =>
  createAppBrowserCompiler(ALL, createPobpackConfig('browser', production));

export type RunDevServerOptions = Pick<
  RunOptions,
  Exclude<keyof RunOptions, 'port' | 'https' | 'headers' | 'proxy'>
>;

export const runDevServer = (
  compiler: PobpackCompiler,
  port: number,
  proxyPort: number,
  options?: RunDevServerOptions,
): ReturnType<typeof runDevServerPobpack> =>
  runDevServerPobpack(compiler, {
    port: proxyPort,
    https: false,

    contentBase: path.resolve('public'),
    watchContentBase: true,

    headers: {
      // avoid errors in console
      'Access-Control-Expose-Headers': 'SourceMap,X-SourceMap',
    },

    proxy: {
      '**': `http://localhost:${port}`,
    },

    ...options,
  });
