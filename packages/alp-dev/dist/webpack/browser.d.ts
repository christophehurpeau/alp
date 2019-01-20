import { RunOptions } from 'pobpack-browser';
import { PobpackCompiler } from 'pobpack-types';
export declare const createModernBrowserCompiler: (production: boolean) => PobpackCompiler;
export declare const createOlderBrowserCompiler: (production: boolean) => PobpackCompiler;
export declare type RunDevServerOptions = Pick<RunOptions, Exclude<keyof RunOptions, 'port' | 'https' | 'headers' | 'proxy'>>;
export declare const runDevServer: (compiler: PobpackCompiler, port: number, proxyPort: number, options?: Pick<RunOptions, "host" | "public" | "open" | "setup" | "inline" | "watchOptions" | "stats" | "after" | "allowedHosts" | "bonjour" | "clientLogLevel" | "contentBase" | "disableHostCheck" | "filename" | "historyApiFallback" | "hotOnly" | "index" | "lazy" | "noInfo" | "openPage" | "pfx" | "pfxPassphrase" | "publicPath" | "socket" | "staticOptions" | "useLocalIp" | "watchContentBase"> | undefined) => any;
//# sourceMappingURL=browser.d.ts.map