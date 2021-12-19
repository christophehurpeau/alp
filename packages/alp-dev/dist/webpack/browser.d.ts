import WebpackDevServer from 'webpack-dev-server';
import type { PobpackCompiler } from '../pobpack/types';
export declare const createModernBrowserCompiler: (production: boolean) => PobpackCompiler;
export declare const createOlderBrowserCompiler: (production: boolean) => PobpackCompiler;
export declare type RunDevServerOptions = Pick<WebpackDevServer.Configuration, 'https'>;
export declare const runDevServer: (compiler: PobpackCompiler, port: number, proxyPort: number, options?: RunDevServerOptions | undefined) => WebpackDevServer;
//# sourceMappingURL=browser.d.ts.map