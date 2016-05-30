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
    return (0, _fs.existsSync)(`${ dirname }${ name }.json`);
}

function _loadConfigSync(dirname, name) {
    var content = (0, _fs.readFileSync)(`${ dirname }${ name }.json`);
    return (0, _parseJsonObjectAsMap2.default)(content);
}

class Config {

    constructor(dirname) {
        this._map = new Map();
        this._dirname = dirname.replace(/\/*$/, '/');
    }

    loadSync() {
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
                var _ref = _step.value;

                var _ref2 = _slicedToArray(_ref, 2);

                var key = _ref2[0];
                var value = _ref2[1];

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
                    var _ref3 = _step2.value;

                    var _ref4 = _slicedToArray(_ref3, 2);

                    var _key = _ref4[0];
                    var _value = _ref4[1];

                    config.set(_key, _value);
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

        argvOverrides.forEach(key => {
            var splitted = key.split('.');
            var value = splitted.length !== 0 && splitted.reduce((config, partialKey) => config && config[partialKey], _minimistArgv2.default);
            if (value !== undefined) {
                var last = splitted.pop();
                var map = splitted.length === 0 ? config : splitted.reduce((config, partialKey) => config.get(partialKey), config);
                map.set(last, value);
            }
        });

        return this._map = (0, _deepFreezeEs2.default)(config);
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

exports.Config = Config;
function alpConfig(dirname) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return (app, config) => {
        if (!config) {
            config = new Config(dirname, options);
            config.loadSync(options);
        }

        app.existsConfig = (0, _util.deprecate)(name => config.existsConfigSync(name), 'use app.existsConfigSync');
        app.loadConfig = (0, _util.deprecate)(name => config.loadConfigSync(name), 'use app.loadConfigSync');

        app.config = config;
        app.context.config = config;

        return config;
    };
}
//# sourceMappingURL=index.js.map