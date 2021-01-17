import path from 'path';
import type { RunOptions } from 'pobpack-browser';
import {
  createAppBrowserCompiler,
  MODERN,
  ALL,
  runDevServer as runDevServerPobpack,
} from 'pobpack-browser';
import type { PobpackCompiler } from 'pobpack-types';
import type WebpackDevServer from 'webpack-dev-server';
import createPobpackConfig from './createPobpackConfig';

export const createModernBrowserCompiler = (
  production: boolean,
): PobpackCompiler =>
  createAppBrowserCompiler(
    MODERN,
    createPobpackConfig('modern-browser', production),
    { progressBar: false },
  );

export const createOlderBrowserCompiler = (
  production: boolean,
): PobpackCompiler =>
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
): WebpackDevServer =>
  runDevServerPobpack(compiler, {
    port: proxyPort,
    https: false,

    contentBase: path.resolve('public'),
    watchContentBase: true,

    headers: {
      // avoid errors in console
      'Access-Control-Expose-Headers': 'SourceMap,X-SourceMap',
    },

    transportMode: 'ws',

    proxy: {
      '/ws': { target: `http://localhost:${port}`, ws: true },
      '**': { target: `http://localhost:${port}` },
    },

    ...options,
  });
