import { deprecate } from 'util';
import argv from 'minimist-argv';
import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import { existsSync, readFileSync } from 'fs';

function _existsConfigSync(dirname, name) {
    if (!(typeof dirname === 'string')) {
        throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dirname));
    }

    if (!(typeof name === 'string')) {
        throw new TypeError('Value of argument "name" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(name));
    }

    return existsSync(`${ dirname }${ name }.json`);
}

function _loadConfigSync(dirname, name) {
    if (!(typeof dirname === 'string')) {
        throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dirname));
    }

    if (!(typeof name === 'string')) {
        throw new TypeError('Value of argument "name" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(name));
    }

    var content = readFileSync(`${ dirname }${ name }.json`);
    return parseJSON(content);
}

var ConfigOptions = function () {
    function ConfigOptions(input) {
        return input != null && (input.argv === undefined || Array.isArray(input.argv) && input.argv.every(function (item) {
            return typeof item === 'string';
        })) && (input.packageConfig === undefined || input.packageConfig instanceof Object) && (input.version === undefined || typeof input.version === 'string');
    }

    ;
    Object.defineProperty(ConfigOptions, Symbol.hasInstance, {
        value: function value(input) {
            return ConfigOptions(input);
        }
    });
    return ConfigOptions;
}();

export class Config {

    constructor(dirname) {
        if (!(typeof dirname === 'string')) {
            throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dirname));
        }

        this._map = new Map();

        if (!(this._map instanceof Map)) {
            throw new TypeError('Value of "this._map" violates contract.\n\nExpected:\nMap\n\nGot:\n' + _inspect(this._map));
        }

        this._dirname = dirname.replace(/\/*$/, '/');

        if (!(typeof this._dirname === 'string')) {
            throw new TypeError('Value of "this._dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(this._dirname));
        }
    }

    loadSync(options = {}) {
        function _ref(_id) {
            if (!(_id instanceof Map)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nMap\n\nGot:\n' + _inspect(_id));
            }

            return _id;
        }

        if (!ConfigOptions(options)) {
            throw new TypeError('Value of argument "options" violates contract.\n\nExpected:\nConfigOptions\n\nGot:\n' + _inspect(options));
        }

        var env = process.env.CONFIG_ENV || process.env.NODE_ENV || 'development';
        var { argv: argvOverrides = [], packageConfig, version } = options;
        this.packageConfig = packageConfig;

        if (!(this.packageConfig instanceof Object)) {
            throw new TypeError('Value of "this.packageConfig" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(this.packageConfig));
        }

        var config = this.loadConfigSync('common');
        _loadConfigSync2 = this.loadConfigSync(env);

        if (!(_loadConfigSync2 && (typeof _loadConfigSync2[Symbol.iterator] === 'function' || Array.isArray(_loadConfigSync2)))) {
            throw new TypeError('Expected _loadConfigSync2 to be iterable, got ' + _inspect(_loadConfigSync2));
        }

        for (var [key, value] of _loadConfigSync2) {
            var _loadConfigSync2;

            config.set(key, value);
        }

        if (this.existsConfigSync('local')) {
            _loadConfigSync3 = this.loadConfigSync('local');

            if (!(_loadConfigSync3 && (typeof _loadConfigSync3[Symbol.iterator] === 'function' || Array.isArray(_loadConfigSync3)))) {
                throw new TypeError('Expected _loadConfigSync3 to be iterable, got ' + _inspect(_loadConfigSync3));
            }

            for (var [_key, _value] of _loadConfigSync3) {
                var _loadConfigSync3;

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
            var value = splitted.length !== 0 && splitted.reduce((config, partialKey) => {
                return config && config[partialKey];
            }, argv);
            if (value !== undefined) {
                var last = splitted.pop();
                var map = splitted.length === 0 ? config : splitted.reduce((config, partialKey) => {
                    return config.get(partialKey);
                }, config);
                map.set(last, value);
            }
        });

        return _ref(this._map = deepFreeze(config));

        if (!(this._map instanceof Map)) {
            throw new TypeError('Value of "this._map" violates contract.\n\nExpected:\nMap\n\nGot:\n' + _inspect(this._map));
        }
    }

    get(key) {
        if (!(typeof key === 'string')) {
            throw new TypeError('Value of argument "key" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(key));
        }

        return this._map.get(key);
    }

    existsConfigSync(name) {
        function _ref3(_id3) {
            if (!(typeof _id3 === 'boolean')) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nbool\n\nGot:\n' + _inspect(_id3));
            }

            return _id3;
        }

        if (!(typeof name === 'string')) {
            throw new TypeError('Value of argument "name" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(name));
        }

        return _ref3(_existsConfigSync(this._dirname, name));
    }

    loadConfigSync(name) {
        function _ref4(_id4) {
            if (!(_id4 instanceof Map)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nMap\n\nGot:\n' + _inspect(_id4));
            }

            return _id4;
        }

        if (!(typeof name === 'string')) {
            throw new TypeError('Value of argument "name" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(name));
        }

        return _ref4(_loadConfigSync(this._dirname, name));
    }
}

export default function alpConfig(dirname, options = {}) {
    if (!(dirname == null || typeof dirname === 'string')) {
        throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\n?string\n\nGot:\n' + _inspect(dirname));
    }

    if (!ConfigOptions(options)) {
        throw new TypeError('Value of argument "options" violates contract.\n\nExpected:\nConfigOptions\n\nGot:\n' + _inspect(options));
    }

    return (app, config) => {
        if (!(config == null || config instanceof Config)) {
            throw new TypeError('Value of argument "config" violates contract.\n\nExpected:\n?Config\n\nGot:\n' + _inspect(config));
        }

        if (!config) {
            config = new Config(dirname, options);
            config.loadSync(options);
        }

        app.existsConfig = deprecate(name => {
            return config.existsConfigSync(name);
        }, 'use app.existsConfigSync');
        app.loadConfig = deprecate(name => {
            return config.loadConfigSync(name);
        }, 'use app.loadConfigSync');

        app.existsConfigSync = name => {
            return config.existsConfigSync(name);
        };
        app.loadConfigSync = name => {
            return config.loadConfigSync(name);
        };

        app.config = config;
        app.context.config = config;

        return config;
    };
}

function _inspect(input, depth) {
    var maxDepth = 4;
    var maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(item => _inspect(item, depth) === first)) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if (typeof _ret === "object") return _ret.v;
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        var indent = '  '.repeat(depth - 1);
        var entries = keys.slice(0, maxKeys).map(key => {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=index.js.map