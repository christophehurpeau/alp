import { URL } from 'url';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import type { Configuration } from 'webpack';
import webpack from 'webpack';
import type { Options } from '../../types';

const ExcludesFalsy = Boolean as unknown as <T>(
  x: T | boolean | null | undefined,
) => x is T;

const DEV_CONST = '__DEV__';

export default function createPluginsConfig(
  options: Options,
): NonNullable<Configuration['plugins']> {
  const plugins: unknown[] = [
    ...(options.prependPlugins || []),

    // enforces the entire path of all required modules match the exact case
    // of the actual path on disk. Using this plugin helps alleviate cases
    // for developers working on case insensitive systems like OSX.
    options.env !== 'production' && new CaseSensitivePathsPlugin(),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(options.env),
      [DEV_CONST]: JSON.stringify(options.env !== 'production'),
      ...options.defines,
    }),

    /* replace object-assign ponyfill to use native implementation */

    // Array.isArray
    new webpack.NormalModuleReplacementPlugin(
      /.*\/node_modules\/isarray\/index.js$/,
      new URL('../replacements/Array.isArray.cjs', import.meta.url).pathname,
    ),

    // Object.assign
    new webpack.NormalModuleReplacementPlugin(
      /.*\/node_modules\/(object-assign|extend-shallow)\/index.js$/,
      new URL('../replacements/Object.assign.cjs', import.meta.url).pathname,
    ),

    // Object.setPrototypeOf
    new webpack.NormalModuleReplacementPlugin(
      /.*\/node_modules\/setprototypeof\/index.js$/,
      new URL(
        '../replacements/Object.setPrototypeOf.cjs',
        import.meta.url,
      ).pathname,
    ),

    // Promise
    new webpack.NormalModuleReplacementPlugin(
      /.*\/node_modules\/any-promise\/index.js$/,
      new URL('../replacements/Promise.cjs', import.meta.url).pathname,
    ),

    // String.prototype.repeat
    new webpack.NormalModuleReplacementPlugin(
      /.*\/node_modules\/repeat-string\/index.js$/,
      new URL(
        '../replacements/String.prototype.repeat.cjs',
        import.meta.url,
      ).pathname,
    ),

    // Symbol.observable
    // https://github.com/tc39/proposal-observable
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/observable
    // new webpack.NormalModuleReplacementPlugin(
    //   /.*\/node_modules\/symbol-observable\/es\/ponyfill.js$/,
    //   new URL('../replacements/Symbol.observable.js', import.meta.url).pathname,
    // ),

    ...options.plugins,
  ];

  return plugins.filter(ExcludesFalsy) as NonNullable<Configuration['plugins']>;
}
