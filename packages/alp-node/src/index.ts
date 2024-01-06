import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { Logger } from 'nightingale-logger';
import type { AlpNodeAppOptions } from './AlpNodeApp';
import { AlpNodeApp } from './AlpNodeApp';
import { Config } from './config';

export type {
  BaseContext,
  NodeApplication,
  NodeConfig,
  ContextState,
  ContextSanitizedState,
} from './types';
export type { Context } from './AlpNodeApp';

const logger = new Logger('alp');

export const appDirname = path.resolve('build');

const packagePath = path.resolve('package.json');
if (!packagePath) {
  throw new Error(`Could not find package.json: "${String(packagePath)}"`);
}
export const packageDirname = path.dirname(packagePath);

logger.debug('init', { appDirname, packageDirname });

export const packageConfig: Record<string, unknown> = JSON.parse(
  readFileSync(packagePath, 'utf8'),
) as Record<string, unknown>;

const buildedConfigPath = `${appDirname}/build/config/`;
const configPath = existsSync(buildedConfigPath)
  ? buildedConfigPath
  : `${appDirname}/config/`;

export const config = new Config(configPath).loadSync({ packageConfig });

export type AppOptions = Omit<
  AlpNodeAppOptions,
  'appDirname' | 'config' | 'packageDirname'
>;

export default class App extends AlpNodeApp {
  constructor(options?: AppOptions) {
    super({
      ...options,
      appDirname,
      packageDirname,
      config,
    });
  }
}

export { Config } from './config';

export {
  default as router,
  createAlpRouterBuilder,
  type AlpRouteRef,
  type AlpRouter,
} from './router';
