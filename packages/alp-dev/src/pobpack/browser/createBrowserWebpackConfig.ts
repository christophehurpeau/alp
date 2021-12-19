/* eslint-disable camelcase */
/* eslint-disable complexity */
import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import type {
  Options,
  ConfigEntry,
  FilledWebpackConfiguration,
} from '../types';
import {
  createModuleConfig,
  createPluginsConfig,
  createResolveConfig,
} from '../utils';

export type BrowserTargetType = 'modern' | 'all';

export const MODERN = 'modern';
export const ALL = 'all';
export const TARGETS: BrowserTargetType[] = [ALL, MODERN];

const ExcludesFalsy = (Boolean as unknown) as <T>(
  x: T | boolean | null | undefined,
) => x is T;

export default function createBrowserWebpackConfig(target: BrowserTargetType) {
  return (options: Options): FilledWebpackConfiguration => ({
    // production or development
    mode: options.env === 'production' ? 'production' : 'development',

    // Don't attempt to continue if there are any errors.
    bail: options.env === 'production',

    // Target web
    target: target === MODERN ? 'browserslist:modern' : 'browserslist',

    // get right stack traces
    devtool:
      options.env === 'production' ? 'nosources-source-map' : 'source-map',

    infrastructureLogging: {
      level: 'none',
    },

    optimization: {
      nodeEnv: false, // see createPluginsConfig
      emitOnErrors: false,
      minimize: options.env === 'production',
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 2019,
            },
            compress: {
              ecma: 5,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: options.productionProfiling || false,
            keep_fnames: options.productionProfiling || false,
            output: {
              ecma: 5,
              comments: false,
              // issue with emoji
              ascii_only: true,
            },
          },
        }),
        // This is only used in production mode
        new CssMinimizerPlugin(),
      ],
    },

    // use cache
    cache: options.hmr,

    resolveLoader: {
      modules: options.resolveLoaderModules || ['node_modules'],
    },

    resolve: createResolveConfig(
      [target === MODERN ? 'modern-browsers' : undefined, 'browser'].filter(
        ExcludesFalsy,
      ),
      [
        target === MODERN ? 'browser:modern' : undefined,
        'browser',
        options.env === 'production' ? 'production' : 'development',
      ].filter(ExcludesFalsy),
      {
        ...options,
        babel: {
          ...options.babel,
          plugins: [
            ...(options.babel.plugins || []),
            options.hmr && require.resolve('react-refresh/babel'),
          ].filter(ExcludesFalsy),
        },
      },
      {
        'react-native$': 'react-native-web',
        ...(options.productionProfiling
          ? {
              'react-dom$': 'react-dom/profiling',
              'scheduler/tracing': 'scheduler/tracing-profiling',
            }
          : {}),
      },
    ),

    entry: options.entries.reduce(
      (entries: { [key: string]: string[] }, entry: ConfigEntry) => {
        if (typeof entry === 'string') entry = { key: entry, path: entry };
        entries[entry.key] = [
          // options.env !== 'production' && require.resolve('../source-map-support'),
          target !== MODERN && require.resolve('regenerator-runtime/runtime'),
          path.join(path.resolve(options.paths.src as string), entry.path),
        ].filter(ExcludesFalsy);
        return entries;
      },
      {},
    ),

    output: {
      path: path.resolve(options.paths.build as string),
      pathinfo: options.env !== 'production',
      filename: '[name].js',
      chunkFilename:
        options.env !== 'production'
          ? 'static/js/[name].[contenthash:8].chunk.js'
          : 'static/js/[name].chunk.js',
      assetModuleFilename: 'static/media/[name].[contenthash:8][ext]',
      publicPath: options.paths.build,

      // Point sourcemap entries to original disk location
      devtoolModuleFilenameTemplate:
        options.env === 'production'
          ? (info: { absoluteResourcePath: string }) =>
              path
                .relative(
                  options.paths.src as string,
                  info.absoluteResourcePath,
                )
                .replace(/\\/g, '/')
          : // eslint-disable-next-line unicorn/no-nested-ternary
          options.env === 'development'
          ? (info: { absoluteResourcePath: string }) =>
              path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
          : undefined,
    },

    module: createModuleConfig(options),

    plugins: [
      ...createPluginsConfig(options),
      options.hmr &&
        new ReactRefreshWebpackPlugin({
          overlay: false,
        }),
      options.env === 'production' &&
      options.paths.src &&
      options.serviceWorkerEntry
        ? new WorkboxWebpackPlugin.InjectManifest({
            swSrc: path.resolve(
              options.paths.src,
              options.serviceWorkerEntry.endsWith('.js') ||
                options.serviceWorkerEntry.endsWith('.ts')
                ? options.serviceWorkerEntry
                : `${options.serviceWorkerEntry}${
                    options.typescript ? '.ts' : '.js'
                  }`,
            ),
            compileSrc: true,
            dontCacheBustURLsMatching: /\.[\da-f]{8}\./,
            exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
          })
        : undefined,
    ].filter(ExcludesFalsy),
  });
}
