'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = /**
                      * @function
                     */ function () { /**
                                       * @function
                                       * @param arr
                                       * @param i
                                      */ function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return (/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @function
                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @param arr
                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @param i
                                                                                                                                                                                                                                                                                                                                                                                                                                                          */ function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } } ); }();

exports.default = alpConfig;

var _storedConfig = require('./storedConfig');

var storedConfig = _interopRequireWildcard(_storedConfig);

var _parseJsonObjectAsMap = require('parse-json-object-as-map');

var _parseJsonObjectAsMap2 = _interopRequireDefault(_parseJsonObjectAsMap);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @function
 * @param fn
*/
function _asyncToGenerator(fn) { return (/**
                                         * @function
                                        */ function () { var gen = fn.apply(this, arguments); return new Promise( /**
                                                                                                                   * @function
                                                                                                                   * @param resolve
                                                                                                                   * @param reject
                                                                                                                  */ function (resolve, reject) { /**
                                                                                                                                                   * @function
                                                                                                                                                   * @param key
                                                                                                                                                   * @param arg
                                                                                                                                                  */ function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then( /**
                                                                                                                                                                                                                                                                                                                                                                 * @function
                                                                                                                                                                                                                                                                                                                                                                 * @param value
                                                                                                                                                                                                                                                                                                                                                                */ function (value) { return step("next", value); }, /**
                                                                                                                                                                                                                                                                                                                                                                                                                      * @function
                                                                                                                                                                                                                                                                                                                                                                                                                      * @param err
                                                                                                                                                                                                                                                                                                                                                                                                                     */ function (err) { return step("throw", err); }); } } return step("next"); }); } ); } /* global fetch */


/**
 * @function
 * @param path
*/

function fetchConfig(path) {
    return fetch(`${ path }.json`).then(res => res.text()).then(text => (0, _parseJsonObjectAsMap2.default)(text)).catch(() => false);
}

/**
 * @param {string} path
 * @returns {Promise|Map}
 * @function
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
 * @function
*/
function existsConfig(path) {
    if (storedConfig.has(path)) {
        return storedConfig.get(path) !== false;
    }
    return fetchConfig(path);
}

const getOrFetchAppConfig = /**
                             * @function
                             * @param version
                             * @param environment
                             * @param configPath
                            */(() => {
    var ref = _asyncToGenerator( /**
                                  * @function
                                  * @param version
                                  * @param environment
                                  * @param configPath
                                 */function* (version, environment, configPath) {
        if (storedConfig.getVersion() === version && storedConfig.has('_appConfig')) {
            return storedConfig.get('_appConfig');
        }

        storedConfig.clear(version);

        const jsonConfig = yield Promise.all([getConfig(`${ configPath }common`), environment && getConfig(`${ configPath }environment`), getConfig(`${ configPath }local`)]);
        const config = jsonConfig[0] || new Map();
        jsonConfig.slice(1).filter(Boolean).forEach( /**
                                                      * @function
                                                      * @param jsonConfig
                                                     */function (jsonConfig) {
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

    return (/**
            * @function
            * @param _x
            * @param _x2
            * @param _x3
           */function getOrFetchAppConfig(_x, _x2, _x3) {
            return ref.apply(this, arguments);
        }
    );
})();

/**
 * @function
 * @param configPath
*/function alpConfig(configPath) {
    configPath = configPath.replace(/\/*$/, '/');
    return (/**
            * @function
            * @param app
           */(() => {
            var ref = _asyncToGenerator( /**
                                          * @function
                                          * @param app
                                         */function* (app) {
                app.existsConfig = /**
                                    * @function
                                    * @param name
                                   */function (name) {
                    return existsConfig(`${ configPath }${ name }`);
                };
                app.loadConfig = /**
                                  * @function
                                  * @param name
                                 */function (name) {
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

            return (/**
                    * @function
                    * @param _x4
                   */function (_x4) {
                    return ref.apply(this, arguments);
                }
            );
        })()
    );
}
//# sourceMappingURL=browser.js.map