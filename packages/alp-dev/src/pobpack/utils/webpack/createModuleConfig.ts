import { resolve } from 'path';
import type { Configuration } from 'webpack';
import type { Options } from '../../types';

export default function createModuleConfig(
  options: Options,
): NonNullable<Configuration['module']> {
  return {
    strictExportPresence: true,

    rules: [
      // tsx? / jsx?
      {
        test: options.typescript ? /\.(mjs|[jt]sx?)$/ : /\.(mjs|jsx?)$/,
        include: [
          resolve(options.paths.src as string),
          ...options.includePaths,
        ],
        rules: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              cacheDirectory: true,
              ...options.babel,
            },
          },
        ],
      },

      // other rules
      ...(options.moduleRules || []),
    ],
  };
}
