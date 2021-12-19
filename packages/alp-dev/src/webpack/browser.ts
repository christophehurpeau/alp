import path from 'path';
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
import ignoredFiles from 'react-dev-utils/ignoredFiles';
import noopServiceWorkerMiddleware from 'react-dev-utils/noopServiceWorkerMiddleware';
import WebpackDevServer from 'webpack-dev-server';
import { createAppBrowserCompiler, MODERN, ALL } from '../pobpack/browser';
import type { PobpackCompiler } from '../pobpack/types';
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

export type RunDevServerOptions = Pick<WebpackDevServer.Configuration, 'https'>;

export const runDevServer = (
  compiler: PobpackCompiler,
  port: number,
  proxyPort: number,
  options?: RunDevServerOptions,
): WebpackDevServer => {
  const browserDevServer = new WebpackDevServer(
    {
      host: process.env.ALP_DEV_WEBPACK_DEV_SERVER_HOST || '0.0.0.0',
      port: proxyPort,
      hot: true,
      allowedHosts: 'all',

      devMiddleware: {
        publicPath: '/',
      },

      client: {
        logging: 'none',
        overlay: {
          errors: true,
          warnings: false,
        },
        webSocketURL: { pathname: '/webpack-ws' },
      },

      proxy: {
        '/ws': { target: `http://localhost:${port}`, ws: true },
        '**': { target: `http://localhost:${port}` },
      },

      static: {
        directory: path.resolve('public'),
        // use react-scripts ignoredFiles for perf
        watch: {
          ignored: ignoredFiles(path.resolve('src')),
        },
      },

      headers: {
        // avoid errors in console
        'Access-Control-Expose-Headers': 'SourceMap,X-SourceMap',
      },

      https: false,

      onBeforeSetupMiddleware(devServer) {
        // https://github.com/facebook/create-react-app/blob/30ee52cf3b2cbb6ac70999c02b1196bcaba8d4ca/packages/react-scripts/config/webpackDevServer.config.js#L99
        // This lets us fetch source contents from webpack for the error overlay
        // @ts-expect-error react-dev-tools types is not up-to-date
        devServer.app.use(evalSourceMapMiddleware(devServer));
      },

      onAfterSetupMiddleware(devServer) {
        // This service worker file is effectively a 'no-op' that will reset any
        // previous service worker registered for the same host:port combination.
        // We do this in development to avoid hitting the production cache if
        // it used the same host and port.
        // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
        devServer.app.use(noopServiceWorkerMiddleware('/'));
      },

      ...options,
    },
    compiler.compiler,
  );

  browserDevServer.start().catch((err: any) => {
    if (err) {
      console.error(err);
    }
  });

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
      browserDevServer.stopCallback(() => {
        process.exit();
      });
    });
  });

  return browserDevServer;
};
