'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Config = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = alpConfig;

var _util = require('util');

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

var _deepFreezeEs = require('deep-freeze-es6');

var _deepFreezeEs2 = _interopRequireDefault(_deepFreezeEs);

var _parseJsonObjectAsMap = require('parse-json-object-as-map');

var _parseJsonObjectAsMap2 = _interopRequireDefault(_parseJsonObjectAsMap);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _existsConfigSync(dirname, name) {
    if (!(typeof dirname === 'string')) {
        throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dirname));
    }

    if (!(typeof name === 'string')) {
        throw new TypeError('Value of argument "name" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(name));
    }

    return (0, _fs.existsSync)(`${ dirname }${ name }.json`);
}

function _loadConfigSync(dirname, name) {
    if (!(typeof dirname === 'string')) {
        throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dirname));
    }

    if (!(typeof name === 'string')) {
        throw new TypeError('Value of argument "name" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(name));
    }

    let content = (0, _fs.readFileSync)(`${ dirname }${ name }.json`);
    return (0, _parseJsonObjectAsMap2.default)(content);
}

const ConfigOptions = function () {
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

class Config {

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

    loadSync() {
        let options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        function _ref(_id) {
            if (!(_id instanceof Map)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nMap\n\nGot:\n' + _inspect(_id));
            }

            return _id;
        }

        if (!ConfigOptions(options)) {
            throw new TypeError('Value of argument "options" violates contract.\n\nExpected:\nConfigOptions\n\nGot:\n' + _inspect(options));
        }

        const env = process.env.CONFIG_ENV || process.env.NODE_ENV || 'development';
        var _options$argv = options.argv;
        const argvOverrides = _options$argv === undefined ? [] : _options$argv;
        const packageConfig = options.packageConfig;
        const version = options.version;


        const config = this.loadConfigSync('common');
        _loadConfigSync2 = this.loadConfigSync(env);

        if (!(_loadConfigSync2 && (typeof _loadConfigSync2[Symbol.iterator] === 'function' || Array.isArray(_loadConfigSync2)))) {
            throw new TypeError('Expected _loadConfigSync2 to be iterable, got ' + _inspect(_loadConfigSync2));
        }

        for (let _ref5 of _loadConfigSync2) {
            var _loadConfigSync2;

            var _ref6 = _slicedToArray(_ref5, 2);

            let key = _ref6[0];
            let value = _ref6[1];

            config.set(key, value);
        }

        if (this.existsConfigSync('local')) {
            _loadConfigSync3 = this.loadConfigSync('local');

            if (!(_loadConfigSync3 && (typeof _loadConfigSync3[Symbol.iterator] === 'function' || Array.isArray(_loadConfigSync3)))) {
                throw new TypeError('Expected _loadConfigSync3 to be iterable, got ' + _inspect(_loadConfigSync3));
            }

            for (let _ref7 of _loadConfigSync3) {
                var _loadConfigSync3;

                var _ref8 = _slicedToArray(_ref7, 2);

                let key = _ref8[0];
                let value = _ref8[1];

                config.set(key, value);
            }
        }

        if (!config.has('version')) {
            config.set('version', version || _minimistArgv2.default.version || packageConfig.version);
        }

        let socketPath = _minimistArgv2.default['socket-path'] || _minimistArgv2.default.socketPath;
        if (socketPath) {
            config.set('socketPath', socketPath);
        } else if (_minimistArgv2.default.port) {
            config.set('port', _minimistArgv2.default.port);
            config.delete('socketPath');
        }

        argvOverrides.forEach(key => {
            const splitted = key.split('.');
            const value = splitted.length !== 0 && splitted.reduce((config, partialKey) => {
                return config && config[partialKey];
            }, _minimistArgv2.default);
            if (value !== undefined) {
                const last = splitted.pop();
                const map = splitted.length === 0 ? config : splitted.reduce((config, partialKey) => {
                    return config.get(partialKey);
                }, config);
                map.set(last, value);
            }
        });

        return _ref(this._map = (0, _deepFreezeEs2.default)(config));

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

exports.Config = Config;
function alpConfig(dirname) {
    let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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

        app.existsConfig = (0, _util.deprecate)(name => {
            return config.existsConfigSync(name);
        }, 'use app.existsConfigSync');
        app.loadConfig = (0, _util.deprecate)(name => {
            return config.loadConfigSync(name);
        }, 'use app.loadConfigSync');

        app.config = config;
        app.context.config = config;

        return config;
    };
}

function _inspect(input, depth) {
    const maxDepth = 4;
    const maxKeys = 15;

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
            if (depth > maxDepth) return '[...]';

            const first = _inspect(input[0], depth);

            if (input.every(item => _inspect(item, depth) === first)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        const keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        const indent = '  '.repeat(depth - 1);
        let entries = keys.slice(0, maxKeys).map(key => {
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