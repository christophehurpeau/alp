type RawConfig = Map<string, any>;

export interface Config {
  get(key: string): any,
}

export interface PackageConfig {
  [key: string]: any;
}

export interface NodeConfig extends Config {
  readonly packageConfig: PackageConfig
}

export interface Context {
  [key: string]: any
}

export type Middleware = (context: Context, next: () => Promise<any>) => any;

export interface ApplicationInCreation {
  config?: Config;
  context: Context,
}

export interface Application extends ApplicationInCreation {
  config: Config;

}

export interface NodeApplicationInCreation extends ApplicationInCreation {
}

export interface BrowserApplicationInCreation extends ApplicationInCreation {
  appVersion: string;
  existsConfig: (name: string) => Promise<boolean> | boolean;
  loadConfig: (name: string) => Promise<RawConfig>;
  createContext(): Context;
}


export interface NodeApplication extends Application {
  config: NodeConfig;
  dirname: string;
  on(event: 'close', callback: () => void): void;
  existsConfigSync(name: string): boolean;
  loadConfigSync(name: string): ReadonlyMap<string, any>;
}

export interface BrowserApplication extends BrowserApplicationInCreation {
  config: Config;
}

export interface HtmlError extends Error {
  status: number;
  expose?: true;
}

export type GoogleParams = 'access_type' | 'include_granted_scopes' | 'login_hint' | 'prompt';
export type SlackParams = 'client_id' | 'team';
