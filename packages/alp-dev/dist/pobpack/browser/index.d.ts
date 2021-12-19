import type { Stats } from 'webpack';
import type { Options, PobpackCompiler, CreateCompilerOptions } from '../types';
import type { BrowserTargetType } from './createBrowserWebpackConfig';
export declare const createAppBrowserCompiler: (target: BrowserTargetType, options: Partial<Options>, compilerOptions?: CreateCompilerOptions | undefined) => PobpackCompiler;
export declare const build: (options?: {}) => Promise<Stats | undefined>[];
export { ALL, MODERN, TARGETS } from './createBrowserWebpackConfig';
//# sourceMappingURL=index.d.ts.map