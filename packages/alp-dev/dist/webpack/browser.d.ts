import type { RunOptions } from 'pobpack-browser';
import type { PobpackCompiler } from 'pobpack-types';
import type WebpackDevServer from 'webpack-dev-server';
export declare const createModernBrowserCompiler: (production: boolean) => PobpackCompiler;
export declare const createOlderBrowserCompiler: (production: boolean) => PobpackCompiler;
export declare type RunDevServerOptions = Pick<RunOptions, Exclude<keyof RunOptions, 'port' | 'https' | 'headers' | 'proxy'>>;
export declare const runDevServer: (compiler: PobpackCompiler, port: number, proxyPort: number, options?: Pick<RunOptions, "public" | "index" | "after" | "allowedHosts" | "bonjour" | "clientLogLevel" | "contentBase" | "contentBasePublicPath" | "disableHostCheck" | "filename" | "historyApiFallback" | "host" | "hotOnly" | "http2" | "injectClient" | "injectHot" | "inline" | "lazy" | "liveReload" | "mimeTypes" | "noInfo" | "onListening" | "open" | "openPage" | "pfx" | "pfxPassphrase" | "publicPath" | "serveIndex" | "setup" | "socket" | "sockHost" | "sockPath" | "sockPort" | "staticOptions" | "stats" | "transportMode" | "useLocalIp" | "watchContentBase" | "watchOptions" | "writeToDisk"> | undefined) => WebpackDevServer;
//# sourceMappingURL=browser.d.ts.map