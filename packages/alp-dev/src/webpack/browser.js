import { createAppBrowserCompiler, MODERN, ALL, runDevServer as runDevServerPobpack } from 'pobpack-browser/src';
import createPobpackConfig from './createPobpackConfig';

export const createModernBrowserCompiler = production => (
  createAppBrowserCompiler(MODERN, createPobpackConfig('modern-browser', production))
);

export const createOlderBrowserCompiler = production => (
  createAppBrowserCompiler(ALL, createPobpackConfig('browser', production))
);

export const runDevServer = (compiler, port: number, proxyPort: number) => (
  runDevServerPobpack(compiler, {
    port: proxyPort,
    https: false,

    // contentBase: false,

    headers: {
      // avoid errors in console
      'Access-Control-Expose-Headers': 'SourceMap,X-SourceMap',
    },

    proxy: {
      '**': `http://localhost:${port}`,
    },
  })
);
