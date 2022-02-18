/* eslint-disable complexity */
import { resolve } from 'path';
import type { Configuration } from 'webpack';
import type { Options } from '../../types';

const ExcludesFalsy = Boolean as unknown as <T>(
  x: T | boolean | null | undefined,
) => x is T;

export default function createResolveConfig(
  modulePrefixPackageFields: string[],
  conditionNames: string[],
  options: Options,
  targetAliases?: Options['aliases'],
): NonNullable<Configuration['resolve']> {
  return {
    // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/25209
    // cacheWithContext: false,

    modules: ['node_modules', resolve('src')],
    extensions: [
      options.typescript && '.ts',
      options.typescript && '.tsx',
      '.mjs',
      '.js',
      '.jsx',
    ].filter(ExcludesFalsy),

    conditionNames: [
      ...conditionNames,
      options.env !== 'production' ? 'development' : undefined,
      'import',
    ].filter(ExcludesFalsy),

    mainFields: [
      // eslint-disable-next-line unicorn/prefer-spread
      ...([] as (string | false)[]).concat(
        ...modulePrefixPackageFields.map(
          (prefix: string): (string | false)[] => [
            options.env !== 'production' && `module:${prefix}-dev`,
            `module:${prefix}`,
            // old `webpack:` syntax
            options.env !== 'production' && `webpack:${prefix}-dev`,
            `webpack:${prefix}`,
          ],
        ),
      ),

      options.env !== 'production' && 'module-dev',
      'module',
      // old webpack: syntax
      options.env !== 'production' && 'webpack:main-dev',
      'webpack:main',

      ...(!modulePrefixPackageFields.includes('browser')
        ? []
        : [
            // Browser builds
            options.env !== 'production' && 'browser-dev',
            'browser',
          ]),
      options.env !== 'production' && 'main-dev',
      'main',
    ].filter(ExcludesFalsy),

    aliasFields: [
      // eslint-disable-next-line unicorn/prefer-spread
      ...([] as (string | false)[]).concat(
        ...modulePrefixPackageFields.map(
          (prefix: string): (string | false)[] => [
            options.env !== 'production' && `module:aliases-${prefix}-dev`,
            `module:aliases-${prefix}`,

            // old webpack: syntax
            options.env !== 'production' && `webpack:aliases-${prefix}-dev`,
            `webpack:aliases-${prefix}`,
          ],
        ),
      ),

      options.env !== 'production' && 'module:aliases-dev',
      'module:aliases',

      // old webpack: syntax
      options.env !== 'production' && 'webpack:aliases-dev',
      'webpack:aliases',
      'webpack',
      modulePrefixPackageFields.includes('browser') &&
        options.env !== 'production' &&
        'browser-dev',
      modulePrefixPackageFields.includes('browser') && 'browser',
    ].filter(ExcludesFalsy),

    alias: { ...options.aliases, ...targetAliases },
  };
}