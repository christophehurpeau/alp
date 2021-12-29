import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { Config } from 'alp-node-config';
import findUp from 'findup-sync';
import Logger from 'nightingale-logger';
import type { AlpNodeAppOptions } from './AlpNodeApp';
import { AlpNodeApp } from './AlpNodeApp';

export { default as fetch } from 'node-fetch';

export type { Context } from './AlpNodeApp';
export { Config } from 'alp-node-config';

const logger = new Logger('alp');

// see alp-dev
export const appDirname = path.resolve('build');

const packagePath = findUp('package.json', { cwd: appDirname });
if (!packagePath) {
  throw new Error(`Could not find package.json: "${String(packagePath)}"`);
}
export const packageDirname = path.dirname(packagePath);

logger.debug('init', { appDirname, packageDirname });

export const packageConfig: Record<string, unknown> = JSON.parse(
  readFileSync(packagePath, 'utf-8'),
) as Record<string, unknown>;

const buildedConfigPath = `${appDirname}/build/config/`;
const configPath = existsSync(buildedConfigPath)
  ? buildedConfigPath
  : `${appDirname}/config/`;

export const config = new Config(configPath).loadSync({ packageConfig });

export type AppOptions = Omit<
  AlpNodeAppOptions,
  'appDirname' | 'packageDirname' | 'config'
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
