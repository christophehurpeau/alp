import { resolve } from 'path';
import type { Configuration } from 'webpack';
import type { Options } from '../../types';

const resolveDependency = (dependency: string): string => dependency; // TODO require.resolve(path)

export default function createModuleConfig(
  options: Options,
): NonNullable<Configuration['module']> {
  return {
    strictExportPresence: true,

    rules: [
      // tsx? / jsx?
      {
        test: options.typescript ? /\.(mjs|[jt]sx?)$/ : /\.(mjs|jsx?)$/,
        include: [resolve(options.paths.src!), ...options.includePaths],
        rules: [
          {
            loader: resolveDependency('babel-loader'),
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
