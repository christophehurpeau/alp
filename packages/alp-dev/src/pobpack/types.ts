import type { TransformOptions } from '@babel/core';
import type { Compiler, Configuration, Stats, Watching } from 'webpack';

export interface ConfigPaths {
  build?: string;
  src?: string;
}

export interface ConfigEntryObject {
  key: string;
  path: string;
}

export type ConfigEntry = string | ConfigEntryObject;

export interface Options {
  aliases: Record<string, any>;
  babel: TransformOptions;
  defines: Record<string, any>;
  entries: ConfigEntry[];
  serviceWorkerEntry: false | string;
  env?: string;
  productionProfiling?: boolean;
  hmr?: boolean;
  allowlistExternalExtensions: string[];
  includePaths: string[];
  moduleRules?: NonNullable<Configuration['module']>['rules'];
  paths: ConfigPaths;
  plugins: (
    | NonNullable<Configuration['plugins']>[number]
    | undefined
    | false
  )[];
  prependPlugins?: (
    | NonNullable<Configuration['plugins']>[number]
    | undefined
    | false
  )[];
  resolveLoaderModules?: string[];
  typescript: boolean;
  webpackPrefixPackageFields: string[];
}

export type WatchCallback = (stats: Stats | undefined) => void;

export type FilledWebpackConfigurationKeys =
  | 'mode'
  | 'bail'
  | 'target'
  | 'devtool'
  | 'optimization'
  | 'resolveLoader'
  | 'resolve'
  | 'entry'
  | 'output';
export type FilledWebpackConfiguration = Pick<
  Configuration,
  Exclude<keyof Configuration, FilledWebpackConfigurationKeys>
> &
  Required<Pick<Configuration, FilledWebpackConfigurationKeys>>;

export interface PobpackCompiler {
  clean: () => undefined | Buffer;
  compiler: Compiler;
  run: () => Promise<Stats | undefined>;
  watch: (callback: WatchCallback) => Watching;
  webpackConfig: Readonly<FilledWebpackConfiguration>;
}

export interface CreateCompilerOptions {
  progressBar?: boolean;
  successMessage?: string;
}
