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
    return fetch(`${ path }.json`).then(res => {
        return res.text();
    }).then(text => {
        return (0, _parseJsonObjectAsMap2.default)(text);
    }).catch(() => {
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

const getOrFetchAppConfig = (() => {
    var ref = _asyncToGenerator(function* (version, environment, configPath) {
        if (storedConfig.getVersion() === version && storedConfig.has('_appConfig')) {
            return storedConfig.get('_appConfig');
        }

        storedConfig.clear(version);

        const jsonConfig = yield Promise.all([getConfig(`${ configPath }common`), environment && getConfig(`${ configPath }environment`), getConfig(`${ configPath }local`)]);
        const config = jsonConfig[0] || new Map();
        jsonConfig.slice(1).filter(Boolean).forEach(function (jsonConfig) {
            if (!(jsonConfig && (typeof jsonConfig[Symbol.iterator] === 'function' || Array.isArray(jsonConfig)))) {
                throw new TypeError('Expected jsonConfig to be iterable, got ' + _inspect(jsonConfig));
            }

            for (let _ref of jsonConfig) {
                var _ref2 = _slicedToArray(_ref, 2);

                let key = _ref2[0];
                let value = _ref2[1];

                config.set(key, value);
            }
        });

        storedConfig.set('_appConfig', config);
        return config;
    });

    return function getOrFetchAppConfig(_x, _x2, _x3) {
        return ref.apply(this, arguments);
    };
})();

function alpConfig(configPath) {
    configPath = configPath.replace(/\/*$/, '/');
    return (() => {
        var ref = _asyncToGenerator(function* (app) {
            app.existsConfig = function (name) {
                return existsConfig(`${ configPath }${ name }`);
            };
            app.loadConfig = function (name) {
                return getConfig(`${ configPath }${ name }`);
            };

            const version = app.appVersion;

            if (!version) {
                throw new Error('Missing appVersion');
            }

            const config = yield getOrFetchAppConfig(version, app.environment, configPath);
            app.config = config;
            app.context.config = config;
            app.context.production = !!config.get('production');
            return config;
        });

        return function (_x4) {
            return ref.apply(this, arguments);
        };
    })();
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
//# sourceMappingURL=browser.js.map