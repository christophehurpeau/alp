type RawConfig = ReadonlyMap<string, any>;

export interface Config {
  get: <T>(key: string) => T;
}

export type PackageConfig = Record<string, any>;

export interface NodeConfig extends Config {
  loadConfigSync: (name: string) => RawConfig;
  readonly packageConfig: PackageConfig;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContextState {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContextSanitizedState {}

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
  loadConfigSync: (name: string) => RawConfig;
}

export interface BrowserApplicationInCreation extends ApplicationInCreation {
  appVersion: string;
  existsConfig: (name: string) => Promise<boolean> | boolean;
  loadConfig: (name: string) => Promise<RawConfig>;
  createContext: () => Context;
}

export interface NodeApplication
  extends Application,
    NodeApplicationInCreation {
  config: NodeConfig;
  dirname: string;
  on: (event: "close", callback: () => void) => void;
  existsConfigSync: (name: string) => boolean;
  loadConfigSync: (name: string) => RawConfig;
}

export interface HtmlError extends Error {
  status: number;
  expose?: true;
}
