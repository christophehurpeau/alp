import type { Stats } from 'webpack';
import type { Options, PobpackCompiler, CreateCompilerOptions } from '../types';
import type { BrowserTargetType } from './createBrowserWebpackConfig';
import { TARGETS, ALL, MODERN } from './createBrowserWebpackConfig';
export { TARGETS, ALL, MODERN };
export declare const createAppBrowserCompiler: (target: BrowserTargetType, options: Partial<Options>, compilerOptions?: CreateCompilerOptions | undefined) => PobpackCompiler;
export declare const build: (options?: {}) => Promise<Stats | undefined>[];
//# sourceMappingURL=index.d.ts.map