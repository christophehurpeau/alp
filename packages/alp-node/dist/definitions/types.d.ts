type RawRecordConfig = Readonly<Record<string, unknown>>;
export interface ConfigValues {
    version: string;
    port?: number;
    socketPath?: string;
    hostname?: string;
    tls?: boolean;
    availableLanguages: string[];
}
export interface Config {
    get: <Key extends keyof ConfigValues>(key: Key) => ConfigValues[Key];
}
export interface PackageConfig {
    name?: string;
    version?: string;
    [key: string]: unknown;
}
export interface NodeConfig extends Config {
    loadConfigSync: (name: string) => RawRecordConfig;
    readonly packageConfig: PackageConfig;
}
export interface ContextState {
}
export interface ContextSanitizedState {
}
export interface BaseContext {
    config: Config;
}
export interface Context extends BaseContext {
    state: ContextState;
    sanitizedState: ContextSanitizedState;
    status: number;
    response: any;
    redirect: (url: string) => Promise<void>;
    [key: string]: any;
}
export interface ApplicationInCreation {
    config?: Config;
    context: BaseContext;
}
export interface Application extends ApplicationInCreation {
    config: Config;
}
export interface NodeApplicationInCreation extends ApplicationInCreation {
    loadConfigSync: (name: string) => RawRecordConfig;
}
export interface BrowserApplicationInCreation extends ApplicationInCreation {
    appVersion: string;
    existsConfig: (name: string) => Promise<boolean> | boolean;
    loadConfig: (name: string) => Promise<RawRecordConfig>;
    createContext: () => Context;
}
export interface NodeApplication extends Application, NodeApplicationInCreation {
    config: NodeConfig;
    dirname: string;
    on: (event: "close", callback: () => void) => void;
    existsConfigSync: (name: string) => boolean;
    loadConfigSync: (name: string) => RawRecordConfig;
}
export interface HtmlError extends Error {
    status: number;
    expose?: true;
}
export {};
//# sourceMappingURL=types.d.ts.map