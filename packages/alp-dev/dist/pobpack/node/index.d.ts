import type { Stats, Watching } from 'webpack';
import type { CreateCompilerOptions, Options, PobpackCompiler, WatchCallback } from '../types';
export declare const createAppNodeCompiler: (options: Partial<Options>, compilerOptions?: CreateCompilerOptions | undefined) => PobpackCompiler;
export declare const build: (options?: {}) => Promise<Stats | undefined>;
export declare const watch: (options: Partial<Options>, callback: WatchCallback) => PobpackCompiler;
export interface RunOptions {
    nodeArgs?: (string | number)[];
    args?: (string | number)[];
    cwd?: string;
    displayName?: string;
    key?: string;
}
export declare const watchAndRunCompiler: (compiler: PobpackCompiler, options?: RunOptions) => Pick<Watching, 'close' | 'invalidate'>;
//# sourceMappingURL=index.d.ts.map