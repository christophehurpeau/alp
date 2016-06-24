import { deprecate } from 'util';
import argv from 'minimist-argv';
import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import { existsSync, readFileSync } from 'fs';

function _existsConfigSync(dirname, name) {
    return existsSync(`${ dirname }${ name }.json`);
}

function _loadConfigSync(dirname, name) {
    var content = readFileSync(`${ dirname }${ name }.json`);
    return parseJSON(content);
}

export class Config {

    constructor(dirname) {
        this._map = new Map();
        this._dirname = dirname.replace(/\/*$/, '/');
    }

    loadSync(options = {}) {
        var env = process.env.CONFIG_ENV || process.env.NODE_ENV || 'development';
        var { argv: argvOverrides = [], packageConfig, version } = options;
        this.packageConfig = packageConfig;

        var config = this.loadConfigSync('common');
        for (var [key, value] of this.loadConfigSync(env)) {
            config.set(key, value);
        }

        if (this.existsConfigSync('local')) {
            for (var [_key, _value] of this.loadConfigSync('local')) {
                config.set(_key, _value);
            }
        }

        if (!config.has('version')) {
            config.set('version', version || argv.version || packageConfig.version);
        }

        var socketPath = argv['socket-path'] || argv.socketPath;
        if (socketPath) {
            config.set('socketPath', socketPath);
        } else if (argv.port) {
            config.set('port', argv.port);
            config.delete('socketPath');
        }

        argvOverrides.forEach(key => {
            var splitted = key.split('.');
            var value = splitted.length !== 0 && splitted.reduce((config, partialKey) => config && config[partialKey], argv);
            if (value !== undefined) {
                var last = splitted.pop();
                var map = splitted.length === 0 ? config : splitted.reduce((config, partialKey) => config.get(partialKey), config);
                map.set(last, value);
            }
        });

        return this._map = deepFreeze(config);
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

export default function alpConfig(dirname, options = {}) {
    return (app, config) => {
        if (!config) {
            config = new Config(dirname, options);
            config.loadSync(options);
        }

        app.existsConfig = deprecate(name => config.existsConfigSync(name), 'use app.existsConfigSync');
        app.loadConfig = deprecate(name => config.loadConfigSync(name), 'use app.loadConfigSync');

        app.existsConfigSync = name => config.existsConfigSync(name);
        app.loadConfigSync = name => config.loadConfigSync(name);

        app.config = config;
        app.context.config = config;

        return config;
    };
}
//# sourceMappingURL=index.js.map