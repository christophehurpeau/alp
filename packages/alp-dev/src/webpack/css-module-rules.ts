/* eslint-disable max-lines, complexity */
import path from 'path';
import type { RuleSetLoader, RuleSetRule } from 'webpack';

type Target = 'node' | 'modern-browser' | 'browser';

export interface CreateCssModuleUseOptions {
  target: Target;
  extractLoader: RuleSetLoader;
  global?: boolean;
  plugins: any[];
  production: boolean;
  otherLoaders?: RuleSetLoader[];
}

export interface CreateScssModuleUseOptions {
  target: Target;
  extractLoader: RuleSetLoader;
  global?: boolean;
  plugins: any[];
  production: boolean;
  themeFile?: string;
  otherLoaders?: RuleSetLoader[];
  includePaths?: string[];
}

export interface CreateModuleRulesOptions {
  target: Target;
  extractLoader: RuleSetLoader;
  plugins: any[];
  production: boolean;
  themeFile?: string;
  includePaths?: string[];
}

export interface StylesCacheGroups {
  name: 'styles';
  test: RegExp;
  chunks: 'all';
  enforce: true;
}

type CreateCssModuleUseFn = (
  options: CreateCssModuleUseOptions,
) => RuleSetLoader[];
type CreateScssModuleUseFn = (
  options: CreateScssModuleUseOptions,
) => RuleSetLoader[];
type CreateModuleRulesFn = (options: CreateModuleRulesOptions) => RuleSetRule[];

const ExcludesFalsy = (Boolean as any) as <T>(
  x: T | false | null | undefined,
) => x is T;

const resolveLoader = (loader: string) => require.resolve(loader);

const cssLoaderOptions = function (
  importLoaders: number,
  global: boolean,
  production: boolean,
  targetIsNode: boolean,
): any {
  return {
    sourceMap: !production,
    modules: global
      ? false
      : {
          exportOnlyLocals: targetIsNode,
          localIdentName:
            production !== false
              ? '[hash:base64]'
              : '[name]__[local]___[hash:base64:5]',
        },
    importLoaders,
  };
};

export const createCssModuleUse: CreateCssModuleUseFn = function ({
  target,
  extractLoader,
  global = false,
  plugins,
  production,
  otherLoaders = [],
}) {
  if (global && target === 'node') {
    return [{ loader: resolveLoader('ignore-loader') }];
  }

  return [
    target !== 'node' && extractLoader,
    {
      loader: resolveLoader('css-loader'),
      options: cssLoaderOptions(
        otherLoaders.length + 1 + (!global && !production ? 1 : 0),
        global,
        production,
        target === 'node',
      ),
    },
    !global &&
      !production &&
      target !== 'node' && {
        loader: resolveLoader('typed-css-modules-loader'),
        options: { noEmit: true },
      },
    {
      loader: resolveLoader('postcss-loader'),
      options: {
        ident: 'postcss',
        sourceMap: !production,
        plugins: () => plugins,
      },
    },
    ...otherLoaders,
  ].filter(ExcludesFalsy);
};

const createScssModuleUse: CreateScssModuleUseFn = function ({
  target,
  extractLoader,
  global = false,
  plugins,
  production,
  themeFile,
  includePaths = [],
}) {
  return createCssModuleUse({
    target,
    extractLoader,
    global,
    plugins,
    production,
    otherLoaders: [
      {
        loader: resolveLoader('sass-loader'),
        options: {
          sourceMap: !production,
          prependData: `$env: ${process.env.NODE_ENV};${
            themeFile ? `@import '${path.resolve(themeFile)}';` : ''
          }`,
          sassOptions: {
            outputStyle: production !== false && 'compressed',
            includePaths,
          },
        },
      },
    ],
  });
};

const createCssModuleRule = function (
  options: CreateCssModuleUseOptions,
): RuleSetRule {
  return {
    test: /\.css$/,
    sideEffects: true,
    use: createCssModuleUse(options),
  };
};

const fileExtensions = ['css', 'scss'];

export const stylesCacheGroups = {
  name: 'styles',
  test: new RegExp(`\\.+(${[...fileExtensions].join('|')})$`),
  chunks: 'all',
  enforce: true,
};

export const createModuleRules: CreateModuleRulesFn = function ({
  target,
  extractLoader,
  plugins,
  production,
  themeFile,
  includePaths,
}) {
  return [
    {
      test: /\.scss$/,
      oneOf: [
        {
          test: /\.global\.scss$/,
          sideEffects: true,
          use: createScssModuleUse({
            target,
            extractLoader,
            global: true,
            plugins,
            production,
            themeFile,
            includePaths,
          }),
        },
        {
          sideEffects: true,
          use: createScssModuleUse({
            target,
            extractLoader,
            global: false,
            plugins,
            production,
            themeFile,
            includePaths,
          }),
        },
      ],
    },

    createCssModuleRule({
      target,
      extractLoader,
      global: false,
      plugins,
      production,
    }),
  ];
};
