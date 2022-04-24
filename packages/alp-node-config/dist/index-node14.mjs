import { existsSync, readFileSync } from 'fs';
import deepFreeze from 'deep-freeze-es6';
import argv from 'minimist-argv';
import parseJSON from 'parse-json-object-as-map';

function _existsConfigSync(dirname, name) {
  return existsSync(`${dirname}${name}.json`);
}

function _loadConfigSync(dirname, name) {
  const content = readFileSync(`${dirname}${name}.json`, 'utf-8');
  return parseJSON(content);
}

class Config {
  constructor(dirname, options) {
    this._map = new Map();
    this._dirname = dirname.replace(/\/*$/, '/');

    if (options) {
      this.loadSync(options);
    }
  }

  loadSync(options = {}) {
    const env = process.env.CONFIG_ENV || process.env.NODE_ENV || 'development';
    const {
      argv: argvOverrides = [],
      packageConfig,
      version
    } = options;
    this.packageConfig = packageConfig;
    const config = this.loadConfigSync('common');

    for (const [key, value] of this.loadConfigSync(env)) {
      config.set(key, value);
    }

    if (this.existsConfigSync('local')) {
      for (const [key, value] of this.loadConfigSync('local')) {
        config.set(key, value);
      }
    }

    if (config.has('version')) {
      throw new Error('Cannot have "version", in config.');
    }

    config.set('version', String(version || argv.version || packageConfig?.version));
    const socketPath = argv.socket || argv['socket-path'] || argv.socketPath;

    if (socketPath) {
      config.set('socketPath', socketPath);
    } else if (argv.port) {
      config.set('port', argv.port);
      config.delete('socketPath');
    } else if (process.env.PORT) {
      config.set('port', Number(process.env.PORT));
      config.delete('socketPath');
    }

    argvOverrides.forEach(key => {
      const splitted = key.split('.');
      const value = splitted.length > 0 && // eslint-disable-next-line @typescript-eslint/no-unsafe-return,unicorn/no-array-reduce, @typescript-eslint/no-shadow
      splitted.reduce((config, partialKey) => config?.[partialKey], argv);

      if (value !== undefined) {
        const last = splitted.pop();
        const map = splitted.length === 0 ? config : // eslint-disable-next-line unicorn/no-array-reduce
        splitted.reduce( // eslint-disable-next-line @typescript-eslint/no-shadow
        (config, partialKey) => config.get(partialKey), config);
        map.set(last, value);
      }
    });
    this._map = deepFreeze(config);
    return this;
  }

  get(key) {
    return this._map.get(key);
  }

  existsConfigSync(name) {
    return _existsConfigSync(this._dirname, name);
  }

  loadConfigSync(name) {
    return _loadConfigSync(this._dirname, name);
  }

}
function getConfig(app, config) {
  return config;
}

export { Config, getConfig as default };
//# sourceMappingURL=index-node14.mjs.map
