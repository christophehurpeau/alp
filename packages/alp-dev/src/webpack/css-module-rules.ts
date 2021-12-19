/* eslint-disable max-lines, complexity */
import path from 'path';
import type { RuleSetUseItem, RuleSetRule } from 'webpack';

type Target = 'node' | 'modern-browser' | 'browser';

export interface CreateCssModuleUseOptions {
  target: Target;
  extractLoader: RuleSetUseItem;
  global?: boolean;
  plugins: any[];
  production: boolean;
  otherLoaders?: RuleSetUseItem[];
}

export interface CreateScssModuleUseOptions {
  target: Target;
  extractLoader: RuleSetUseItem;
  global?: boolean;
  plugins: any[];
  production: boolean;
  themeFile?: string;
  otherLoaders?: RuleSetUseItem[];
  includePaths?: string[];
}

export interface CreateModuleRulesOptions {
  target: Target;
  extractLoader: RuleSetUseItem;
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
) => RuleSetUseItem[];
type CreateScssModuleUseFn = (
  options: CreateScssModuleUseOptions,
) => RuleSetUseItem[];
type CreateModuleRulesFn = (options: CreateModuleRulesOptions) => RuleSetRule[];

const ExcludesFalsy = Boolean as any as <T>(
  x: T | false | null | undefined,
) => x is T;

const resolveDependency = (dependency: string): string => dependency; // TODO require.resolve(path)
const resolveLoader = (loader: string): string => resolveDependency(loader);

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
          localIdentName: production
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
        sourceMap: !production,
        postcssOptions: {
          ident: 'postcss',
          plugins,
        },
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
          additionalData: `$env: ${process.env.NODE_ENV!};${
            themeFile ? `@import '${path.resolve(themeFile)}';` : ''
          }`,
          sassOptions: {
            outputStyle: production ? undefined : 'compressed',
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
