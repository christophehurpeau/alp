import type { RunOptions } from 'pobpack-browser';
import type { PobpackCompiler } from 'pobpack-types';
import type WebpackDevServer from 'webpack-dev-server';
export declare const createModernBrowserCompiler: (production: boolean) => PobpackCompiler;
export declare const createOlderBrowserCompiler: (production: boolean) => PobpackCompiler;
export declare type RunDevServerOptions = Pick<RunOptions, Exclude<keyof RunOptions, 'port' | 'https' | 'headers' | 'proxy'>>;
export declare const runDevServer: (compiler: PobpackCompiler, port: number, proxyPort: number, options?: RunDevServerOptions | undefined) => WebpackDevServer;
//# sourceMappingURL=browser.d.ts.map