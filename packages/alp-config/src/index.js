import { deprecate } from 'util';
import argv from 'minimist-argv';
import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import { existsSync, readFileSync } from 'fs';

function _existsConfigSync(dirname: string, name: string) {
    return existsSync(`${dirname}${name}.json`);
}

function _loadConfigSync(dirname: string, name: string) {
    let content = readFileSync(`${dirname}${name}.json`);
    return parseJSON(content);
}

type ConfigOptions = {
    argv?: Array<string>,
    packageConfig?: Object,
    version?: string,
}

export class Config {
    _map: Map;
    _dirname: string;

    constructor(dirname: string) {
        this._map = new Map();
        this._dirname = dirname.replace(/\/*$/, '/');
    }

    loadSync(options: ConfigOptions = {}): Map {
        const env = process.env.CONFIG_ENV || process.env.NODE_ENV || 'development';
        const { argv: argvOverrides = [], packageConfig, version } = options;

        const config = this.loadConfigSync('common');
        for (let [key, value] of this.loadConfigSync(env)) {
            config.set(key, value);
        }

        if (this.existsConfigSync('local')) {
            for (let [key, value] of this.loadConfigSync('local')) {
                config.set(key, value);
            }
        }

        if (!config.has('version')) {
            config.set('version', version || packageConfig.version);
        }

        let socketPath = argv['socket-path'] || argv.socketPath;
        if (socketPath) {
            config.set('socketPath', socketPath);
        } else if (argv.port) {
            config.set('port', argv.port);
            config.delete('socketPath');
        }

        argvOverrides.forEach(key => {
            if (argv[key] !== undefined) {
                const splitted = key.split('.');
                const last = splitted.pop();
                const map = splitted.length === 0 ? config
                    : splitted.reduce((config, partialKey) => config.get(partialKey), config);
                map.set(last, argv[key]);
            }
        });

        return this._map = deepFreeze(config);
    }

    get(key: string): any {
        return this._map.get(key);
    }

    existsConfigSync(name: string): boolean {
        return _existsConfigSync(this._dirname, name);
    }

    loadConfigSync(name: string): Map {
        return _loadConfigSync(this._dirname, name);
    }
}

export default function alpConfig(dirname: ?string, options: ConfigOptions = {}) {
    return (app, config: ?Config) => {
        if (!config) {
            config = new Config(dirname, options);
            config.loadSync(options);
        }

        app.existsConfig = deprecate((name) => config.existsConfigSync(name), 'use app.existsConfigSync');
        app.loadConfig = deprecate((name) => config.loadConfigSync(name), 'use app.loadConfigSync');

        app.config = config;
        app.context.config = config;

        return config;
    };
}
