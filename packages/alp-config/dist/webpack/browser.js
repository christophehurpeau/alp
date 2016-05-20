'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = alpConfig;

var _browserStoredConfig = require('./browserStoredConfig');

var storedConfig = _interopRequireWildcard(_browserStoredConfig);

var _parseJsonObjectAsMap = require('parse-json-object-as-map');

var _parseJsonObjectAsMap2 = _interopRequireDefault(_parseJsonObjectAsMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /* global fetch */


function fetchConfig(path) {
    return fetch(path + '.json').then(function (res) {
        return res.text();
    }).then(function (text) {
        return (0, _parseJsonObjectAsMap2.default)(text);
    }).catch(function () {
        return false;
    });
}

/**
 * @param {string} path
 * @returns {Promise|Map}
 */
function getConfig(path) {
    if (storedConfig.has(path)) {
        return storedConfig.get(path);
    }
    return fetchConfig(path);
}

/**
 * @param {string} path
 * @returns {Promise|Boolean}
 */
function existsConfig(path) {
    if (storedConfig.has(path)) {
        return storedConfig.get(path) !== false;
    }
    return fetchConfig(path);
}

var getOrFetchAppConfig = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(version, environment, configPath) {
        var jsonConfig, config;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(storedConfig.getVersion() === version && storedConfig.has('_appConfig'))) {
                            _context.next = 2;
                            break;
                        }

                        return _context.abrupt('return', storedConfig.get('_appConfig'));

                    case 2:

                        storedConfig.clear(version);

                        _context.next = 5;
                        return Promise.all([getConfig(configPath + 'common'), environment && getConfig(configPath + 'environment'), getConfig(configPath + 'local')]);

                    case 5:
                        jsonConfig = _context.sent;
                        config = jsonConfig[0] || new Map();

                        jsonConfig.slice(1).filter(Boolean).forEach(function (jsonConfig) {
                            var _iteratorNormalCompletion = true;
                            var _didIteratorError = false;
                            var _iteratorError = undefined;

                            try {
                                for (var _iterator = jsonConfig[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
                        });

                        storedConfig.set('_appConfig', config);
                        return _context.abrupt('return', config);

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function getOrFetchAppConfig(_x, _x2, _x3) {
        return ref.apply(this, arguments);
    };
}();

function alpConfig(configPath) {
    configPath = configPath.replace(/\/*$/, '/');
    return function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(app) {
            var version, config;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            app.existsConfig = function (name) {
                                return existsConfig('' + configPath + name);
                            };
                            app.loadConfig = function (name) {
                                return getConfig('' + configPath + name);
                            };

                            version = app.appVersion;

                            if (version) {
                                _context2.next = 5;
                                break;
                            }

                            throw new Error('Missing appVersion');

                        case 5:
                            _context2.next = 7;
                            return getOrFetchAppConfig(version, app.environment, configPath);

                        case 7:
                            config = _context2.sent;

                            app.config = config;
                            app.context.config = config;
                            app.context.production = !!config.get('production');
                            return _context2.abrupt('return', config);

                        case 12:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        return function (_x4) {
            return ref.apply(this, arguments);
        };
    }();
}
//# sourceMappingURL=browser.js.map