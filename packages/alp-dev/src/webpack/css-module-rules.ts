import type { RuleSetUseItem, RuleSetRule } from 'webpack';

type Target = 'node' | 'modern-browser' | 'browser';

export interface CreateCssUseOptions {
  target: Target;
  extractLoader: RuleSetUseItem;
  plugins: any[];
  production: boolean;
  otherLoaders?: RuleSetUseItem[];
}

export interface CreateModuleRulesOptions {
  target: Target;
  extractLoader: RuleSetUseItem;
  plugins: any[];
  production: boolean;
}

export interface StylesCacheGroups {
  name: 'styles';
  test: RegExp;
  chunks: 'all';
  enforce: true;
}

type CreateCssModuleUseFn = (options: CreateCssUseOptions) => RuleSetUseItem[];

const ExcludesFalsy = Boolean as any as <T>(
  x: T | false | null | undefined,
) => x is T;

const resolveDependency = (dependency: string): string => dependency; // TODO require.resolve(path)
const resolveLoader = (loader: string): string => resolveDependency(loader);

const cssLoaderOptions = function (
  importLoaders: number,
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

export const createCssUse: CreateCssModuleUseFn = function ({
  target,
  extractLoader,
  plugins,
  production,
  otherLoaders = [],
}) {
  if (target === 'node') {
    return [{ loader: resolveLoader('ignore-loader') }];
  }

  return [
    extractLoader,
    {
      loader: resolveLoader('css-loader'),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      options: cssLoaderOptions(otherLoaders.length + 1, production, false),
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

export const createCssRule = function (
  options: CreateCssUseOptions,
): RuleSetRule {
  return {
    test: /\.css$/,
    sideEffects: true,
    use: createCssUse(options),
  };
};

const fileExtensions = ['css'];

export const stylesCacheGroups = {
  name: 'styles',
  test: new RegExp(`\\.+(${[...fileExtensions].join('|')})$`),
  chunks: 'all',
  enforce: true,
};
