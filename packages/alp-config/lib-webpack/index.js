'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Config = undefined;

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
    return (0, _fs.existsSync)('' + dirname + name + '.json');
}

function _loadConfigSync(dirname, name) {
    var content = (0, _fs.readFileSync)('' + dirname + name + '.json');
    return (0, _parseJsonObjectAsMap2.default)(content);
}

var Config = exports.Config = function () {
    function Config(dirname) {
        _classCallCheck(this, Config);

        this._map = new Map();
        this._dirname = dirname.replace(/\/*$/, '/');
    }

    _createClass(Config, [{
        key: 'loadSync',
        value: function loadSync() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var env = process.env.CONFIG_ENV || process.env.NODE_ENV || 'development';
            var _options$argv = options.argv;
            var argvOverrides = _options$argv === undefined ? [] : _options$argv;
            var packageConfig = options.packageConfig;
            var version = options.version;


            var config = this.loadConfigSync('common');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.loadConfigSync(env)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.loadConfigSync('local')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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

            return this._map = (0, _deepFreezeEs2.default)(config);
        }
    }, {
        key: 'get',
        value: function get(key) {
            return this._map.get(key);
        }
    }, {
        key: 'existsConfigSync',
        value: function existsConfigSync(name) {
            return _existsConfigSync(this._dirname, name);
        }
    }, {
        key: 'loadConfigSync',
        value: function loadConfigSync(name) {
            return _loadConfigSync(this._dirname, name);
        }
    }]);

    return Config;
}();

function alpConfig(dirname) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return function (app, config) {
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
//# sourceMappingURL=index.js.map