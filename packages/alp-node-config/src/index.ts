import { existsSync, readFileSync } from 'fs';
import argv from 'minimist-argv';
import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import { NodeApplication, NodeConfig, PackageConfig } from 'alp-types';

function _existsConfigSync(dirname: string, name: string) {
  return existsSync(`${dirname}${name}.json`);
}

function _loadConfigSync(dirname: string, name: string) {
  const content = readFileSync(`${dirname}${name}.json`, 'utf-8');
  return parseJSON(content);
}

export interface ConfigOptions {
  argv?: string[];
  packageConfig?: PackageConfig;
  version?: string;
}

export class Config {
  packageConfig?: PackageConfig;

  private _map: Map<string, any>;

  private readonly _dirname: string;

  constructor(dirname: string, options?: ConfigOptions) {
    this._map = new Map();
    this._dirname = dirname.replace(/\/*$/, '/');
    if (options) {
      this.loadSync(options);
    }
  }

  loadSync(options: ConfigOptions = {}): Config & NodeConfig {
    const env = process.env.CONFIG_ENV || process.env.NODE_ENV || 'development';
    const { argv: argvOverrides = [], packageConfig, version } = options;
    this.packageConfig = packageConfig;

    const config = this.loadConfigSync('common');
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of this.loadConfigSync(env)) {
      config.set(key, value);
    }

    if (this.existsConfigSync('local')) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of this.loadConfigSync('local')) {
        config.set(key, value);
      }
    }

    if (config.has('version')) {
      throw new Error('Cannot have "version", in config.');
    }

    config.set(
      'version',
      String(
        version || argv.version || (packageConfig && packageConfig.version),
      ),
    );

    const socketPath = argv['socket-path'] || argv.socketPath;
    if (socketPath) {
      config.set('socketPath', socketPath);
    } else if (argv.port) {
      config.set('port', argv.port);
      config.delete('socketPath');
    } else if (process.env.PORT) {
      config.set('port', Number(process.env.PORT));
      config.delete('socketPath');
    }

    argvOverrides.forEach((key) => {
      const splitted = key.split('.');
      const value =
        splitted.length !== 0 &&
        splitted.reduce(
          (config, partialKey) => config && config[partialKey],
          argv,
        );
      if (value !== undefined) {
        const last = splitted.pop() as string;
        const map =
          splitted.length === 0
            ? config
            : splitted.reduce(
                (config, partialKey) => config.get(partialKey),
                config,
              );
        map.set(last, value);
      }
    });

    this._map = deepFreeze(config);
    return this as Config & NodeConfig;
  }

  get(key: string): any {
    return this._map.get(key);
  }

  existsConfigSync(name: string): boolean {
    return _existsConfigSync(this._dirname, name);
  }

  loadConfigSync(name: string): Map<string, any> {
    return _loadConfigSync(this._dirname, name);
  }
}

export default function getConfig(
  app: NodeApplication,
  config: Config & NodeConfig,
): Config & NodeConfig {
  return config;
}
