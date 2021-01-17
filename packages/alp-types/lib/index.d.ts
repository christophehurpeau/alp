type RawConfig = ReadonlyMap<string, any>;

export interface Config {
  get<T>(key: string): T;
}

export interface PackageConfig {
  [key: string]: any;
}

export interface NodeConfig extends Config {
  loadConfigSync(name: string): RawConfig;
  readonly packageConfig: PackageConfig;
}

interface ContextRequest {
  headers: Record<string, string>;
  host: string;
}

export interface ContextState {}
export interface ContextSanitizedState {}

export interface BaseContext {
  config: Config;
}

export interface Context extends BaseContext {
  state: ContextState;
  sanitizedState: ContextSanitizedState;
  status: number;
  request: ContextRequest;
  response: any;
  redirect: (url: string) => Promise<void>;
  path: string;
  [key: string]: any;
}

export type Middleware = (context: Context, next: () => Promise<any>) => any;

export interface ApplicationInCreation {
  config?: Config;
  context: BaseContext;
}

export interface Application extends ApplicationInCreation {
  config: Config;
}

export interface NodeApplicationInCreation extends ApplicationInCreation {
  loadConfigSync(name: string): RawConfig;
}

export interface BrowserApplicationInCreation extends ApplicationInCreation {
  appVersion: string;
  existsConfig: (name: string) => Promise<boolean> | boolean;
  loadConfig: (name: string) => Promise<RawConfig>;
  createContext(): Context;
}

export interface NodeApplication
  extends Application,
    NodeApplicationInCreation {
  config: NodeConfig;
  dirname: string;
  on(event: 'close', callback: () => void): void;
  existsConfigSync(name: string): boolean;
  loadConfigSync(name: string): RawConfig;
}

export interface BrowserApplication extends BrowserApplicationInCreation {
  config: Config;
}

export interface HtmlError extends Error {
  status: number;
  expose?: true;
}

export type GoogleParams =
  | 'access_type'
  | 'include_granted_scopes'
  | 'login_hint'
  | 'prompt';
export type SlackParams = 'client_id' | 'team';
