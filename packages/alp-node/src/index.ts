import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { Config } from 'alp-node-config';
import Logger from 'nightingale-logger';
import findUp from 'findup-sync';
import { AlpNodeApp, AlpNodeAppOptions } from './AlpNodeApp';

export { Config };

const logger = new Logger('alp');

// see alp-dev
export const appDirname = path.resolve('build');

const packagePath = findUp('package.json', { cwd: appDirname });
if (!packagePath) {
  throw new Error(`Could not find package.json: "${packagePath}"`);
}
export const packageDirname = path.dirname(packagePath);

logger.debug('init', { appDirname, packageDirname });

// eslint-disable-next-line import/no-dynamic-require, global-require
export const packageConfig = JSON.parse(readFileSync(packagePath, 'utf-8'));

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
  constructor(options: AppOptions) {
    super({
      ...options,
      appDirname,
      packageDirname,
      config,
    });
  }
}
