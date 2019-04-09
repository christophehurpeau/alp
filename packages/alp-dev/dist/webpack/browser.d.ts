import { RunOptions } from 'pobpack-browser';
import { PobpackCompiler } from 'pobpack-types';
export declare const createModernBrowserCompiler: (production: boolean) => PobpackCompiler;
export declare const createOlderBrowserCompiler: (production: boolean) => PobpackCompiler;
export declare type RunDevServerOptions = Pick<RunOptions, Exclude<keyof RunOptions, 'port' | 'https' | 'headers' | 'proxy'>>;
export declare const runDevServer: (compiler: PobpackCompiler, port: number, proxyPort: number, options?: Pick<RunOptions, string | number> | undefined) => any;
//# sourceMappingURL=browser.d.ts.map