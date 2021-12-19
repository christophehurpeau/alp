import type { Options, FilledWebpackConfiguration } from '../types';
export declare type CreateWebpackConfig = (options: Options) => FilledWebpackConfiguration;
export declare type CreateWebpackConfigPartialOptions = (options: Partial<Options>) => FilledWebpackConfiguration;
export declare type AppWebpackConfigCreator = (createWebpackConfig: CreateWebpackConfigPartialOptions, options: Partial<Options>) => FilledWebpackConfiguration;
export declare function createAppWebpackConfig(createWebpackConfig: CreateWebpackConfig): CreateWebpackConfigPartialOptions;
//# sourceMappingURL=createAppWebpackConfig.d.ts.map