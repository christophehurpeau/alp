'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getVersion = getVersion;
exports.has = has;
exports.get = get;
exports.save = save;
exports.set = set;
exports.clear = clear;

var _deepFreezeEs = require('deep-freeze-es6');

var _deepFreezeEs2 = _interopRequireDefault(_deepFreezeEs);

var _parseJsonObjectAsMap = require('parse-json-object-as-map');

var _parseJsonObjectAsMap2 = _interopRequireDefault(_parseJsonObjectAsMap);

var _stringifyJson = require('stringify-json');

var _stringifyJson2 = _interopRequireDefault(_stringifyJson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const map = (() => {
    const config = localStorage.getItem('ibex-config');
    if (config === null) {
        return new Map();
    }

    return (0, _parseJsonObjectAsMap2.default)(config);
})(); /* global localStorage */


map.forEach(value => (0, _deepFreezeEs2.default)(value));

function getVersion() {
    return map.get('version');
}

function has(key) {
    return map.has(key);
}

function get(key) {
    return map.get(key);
}

function save() {
    localStorage.setItem('ibex-config', (0, _stringifyJson2.default)(map));
}

function set(key, value) {
    map.set(key, value);
    save();
}

function clear(version) {
    map.clear();
    map.set('version', version);
    save();
}
//# sourceMappingURL=browserStoredConfig.js.map