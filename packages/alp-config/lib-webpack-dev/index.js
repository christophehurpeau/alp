'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Config = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _existsConfigSync(dirname, name) {
    if (!(typeof dirname === 'string')) {
        throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dirname));
    }

    if (!(typeof name === 'string')) {
        throw new TypeError('Value of argument "name" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(name));
    }

    return (0, _fs.existsSync)('' + dirname + name + '.json');
}

function _loadConfigSync(dirname, name) {
    if (!(typeof dirname === 'string')) {
        throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dirname));
    }

    if (!(typeof name === 'string')) {
        throw new TypeError('Value of argument "name" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(name));
    }

    var content = (0, _fs.readFileSync)('' + dirname + name + '.json');
    return (0, _parseJsonObjectAsMap2.default)(content);
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

var Config = exports.Config = function () {
    function Config(dirname) {
        _classCallCheck(this, Config);

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

    _createClass(Config, [{
        key: 'loadSync',
        value: function loadSync() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
            var _options$argv = options.argv;
            var argvOverrides = _options$argv === undefined ? [] : _options$argv;
            var packageConfig = options.packageConfig;
            var version = options.version;


            var config = this.loadConfigSync('common');
            _loadConfigSync2 = this.loadConfigSync(env);

            if (!(_loadConfigSync2 && (typeof _loadConfigSync2[Symbol.iterator] === 'function' || Array.isArray(_loadConfigSync2)))) {
                throw new TypeError('Expected _loadConfigSync2 to be iterable, got ' + _inspect(_loadConfigSync2));
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _loadConfigSync2[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _loadConfigSync2;

                    var _step$value = _slicedToArray(_step.value, 2);

                    var key = _step$value[0];
                    var value = _step$value[1];

                    config.set(key, value);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (this.existsConfigSync('local')) {
                _loadConfigSync3 = this.loadConfigSync('local');

                if (!(_loadConfigSync3 && (typeof _loadConfigSync3[Symbol.iterator] === 'function' || Array.isArray(_loadConfigSync3)))) {
                    throw new TypeError('Expected _loadConfigSync3 to be iterable, got ' + _inspect(_loadConfigSync3));
                }

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = _loadConfigSync3[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _loadConfigSync3;

                        var _step2$value = _slicedToArray(_step2.value, 2);

                        var key = _step2$value[0];
                        var value = _step2$value[1];

                        config.set(key, value);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }

            if (!config.has('version')) {
                config.set('version', version || _minimistArgv2.default.version || packageConfig.version);
            }

            var socketPath = _minimistArgv2.default['socket-path'] || _minimistArgv2.default.socketPath;
            if (socketPath) {
                config.set('socketPath', socketPath);
            } else if (_minimistArgv2.default.port) {
                config.set('port', _minimistArgv2.default.port);
                config.delete('socketPath');
            }

            argvOverrides.forEach(function (key) {
                var splitted = key.split('.');
                var value = splitted.length !== 0 && splitted.reduce(function (config, partialKey) {
                    return config && config[partialKey];
                }, _minimistArgv2.default);
                if (value !== undefined) {
                    var last = splitted.pop();
                    var map = splitted.length === 0 ? config : splitted.reduce(function (config, partialKey) {
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
    }, {
        key: 'get',
        value: function get(key) {
            if (!(typeof key === 'string')) {
                throw new TypeError('Value of argument "key" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(key));
            }

            return this._map.get(key);
        }
    }, {
        key: 'existsConfigSync',
        value: function existsConfigSync(name) {
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
    }, {
        key: 'loadConfigSync',
        value: function loadConfigSync(name) {
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
    }]);

    return Config;
}();

function alpConfig(dirname) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (!(dirname == null || typeof dirname === 'string')) {
        throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\n?string\n\nGot:\n' + _inspect(dirname));
    }

    if (!ConfigOptions(options)) {
        throw new TypeError('Value of argument "options" violates contract.\n\nExpected:\nConfigOptions\n\nGot:\n' + _inspect(options));
    }

    return function (app, config) {
        if (!(config == null || config instanceof Config)) {
            throw new TypeError('Value of argument "config" violates contract.\n\nExpected:\n?Config\n\nGot:\n' + _inspect(config));
        }

        if (!config) {
            config = new Config(dirname, options);
            config.loadSync(options);
        }

        app.existsConfig = (0, _util.deprecate)(function (name) {
            return config.existsConfigSync(name);
        }, 'use app.existsConfigSync');
        app.loadConfig = (0, _util.deprecate)(function (name) {
            return config.loadConfigSync(name);
        }, 'use app.loadConfigSync');

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
        return typeof input === 'undefined' ? 'undefined' : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(function (item) {
                    return _inspect(item, depth) === first;
                })) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(function (item) {
                            return _inspect(item, depth);
                        }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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
        var entries = keys.slice(0, maxKeys).map(function (key) {
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