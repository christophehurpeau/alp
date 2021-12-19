import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import type { Configuration } from 'webpack';
import type { Options as NodeExternalsOptions } from 'webpack-node-externals';
import nodeExternals from 'webpack-node-externals';
import type {
  ConfigEntry,
  Options,
  FilledWebpackConfiguration,
} from '../types';
import {
  webpack,
  createModuleConfig,
  createPluginsConfig,
  createResolveConfig,
} from '../utils';

const ExcludesFalsy = Boolean as any as <T>(
  x: T | false | null | undefined,
) => x is T;

const createExternals = (
  options: Options,
): NonNullable<Configuration['externals']> => {
  const baseOptions: NodeExternalsOptions = {
    // @ts-expect-error module is valid but as an experiment
    importType: 'module',
    modulesFromFile: false,
    allowlist: [
      new URL('../node-hot.mjs', import.meta.url).pathname,
      // TODO remove this when exports is added in these libs
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      ...(options.allowlistExternalExtensions
        ? [new RegExp(`(${options.allowlistExternalExtensions.join('|')})$`)]
        : []),
    ],
  };

  const nodeModulesPaths: string[] = [];
  let p = process.cwd();
  do {
    const nodeModulesCurrentPath = path.join(p, 'node_modules');
    if (fs.existsSync(nodeModulesCurrentPath)) {
      nodeModulesPaths.push(nodeModulesCurrentPath);
    }
    p = path.dirname(p);
  } while (p !== '/');

  return nodeModulesPaths.map((nodeModulesPath) =>
    nodeExternals({ ...baseOptions, modulesDir: nodeModulesPath }),
  );
};

export function createNodeWebpackConfig(
  options: Options,
): FilledWebpackConfiguration {
  return {
    // production or development
    mode: options.env === 'production' ? 'production' : 'development',

    // Don't attempt to continue if there are any errors.
    bail: options.env === 'production',

    // Target node
    target: 'node14',

    // get right stack traces
    devtool: 'source-map',

    infrastructureLogging: {
      level: 'none',
    },

    optimization: {
      nodeEnv: false, // see createPluginsConfig
      emitOnErrors: false,
      minimize: false,
    },

    // don't bundle node_modules dependencies
    externalsPresets: { node: true },
    externals: createExternals(options),

    // use cache
    cache: options.hmr,

    // bundle size is not relevant for node
    performance: {
      hints: false,
    },

    resolveLoader: {
      modules: options.resolveLoaderModules || ['node_modules'],
    },

    resolve: createResolveConfig(
      ['node'],
      ['node', options.env === 'production' ? 'production' : 'development'],
      {
        ...options,
        babel: options.babel,
      },
      {
        // TODO remove this when exports is added in these libs
        'react/jsx-dev-runtime$': 'react/jsx-dev-runtime.js',
        'react/jsx-runtime$': 'react/jsx-runtime.js',
      },
    ),

    // eslint-disable-next-line unicorn/no-array-reduce, unicorn/prefer-object-from-entries
    entry: options.entries.reduce(
      (entries: Record<string, string[]>, entry: ConfigEntry) => {
        if (typeof entry === 'string') entry = { key: entry, path: entry };
        entries[entry.key] = [
          options.hmr
            ? new URL('../node-hot.mjs', import.meta.url).pathname
            : undefined,
          path.join(path.resolve(options.paths.src!), entry.path),
        ].filter(ExcludesFalsy);
        return entries;
      },
      {},
    ),

    experiments: {
      outputModule: true,
    },

    output: {
      filename: '[name].mjs',
      path: path.resolve(options.paths.build!),
      libraryTarget: 'module',
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    },

    module: createModuleConfig(options),

    plugins: [
      options.hmr && new webpack.HotModuleReplacementPlugin(),
      ...createPluginsConfig(options),
    ].filter(ExcludesFalsy),
  };
}
