import { RunOptions } from 'pobpack-browser';
import { PobpackCompiler } from 'pobpack-types';
import WebpackDevServer from 'webpack-dev-server';
export declare const createModernBrowserCompiler: (production: boolean) => PobpackCompiler;
export declare const createOlderBrowserCompiler: (production: boolean) => PobpackCompiler;
export declare type RunDevServerOptions = Pick<RunOptions, Exclude<keyof RunOptions, 'port' | 'https' | 'headers' | 'proxy'>>;
export declare const runDevServer: (compiler: PobpackCompiler, port: number, proxyPort: number, options?: Pick<RunOptions, "public" | "index" | "after" | "allowedHosts" | "bonjour" | "clientLogLevel" | "contentBase" | "disableHostCheck" | "filename" | "historyApiFallback" | "host" | "hotOnly" | "inline" | "lazy" | "noInfo" | "open" | "openPage" | "pfx" | "pfxPassphrase" | "publicPath" | "setup" | "socket" | "sockPath" | "staticOptions" | "stats" | "useLocalIp" | "watchContentBase" | "watchOptions" | "writeToDisk"> | undefined) => WebpackDevServer;
//# sourceMappingURL=browser.d.ts.map