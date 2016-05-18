'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = alpConfig;

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

var _deepFreezeEs = require('deep-freeze-es6');

var _deepFreezeEs2 = _interopRequireDefault(_deepFreezeEs);

var _parseJsonObjectAsMap = require('parse-json-object-as-map');

var _parseJsonObjectAsMap2 = _interopRequireDefault(_parseJsonObjectAsMap);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function existsConfig(dirname, name) {
    return (0, _fs.existsSync)(`${ dirname }${ name }.json`);
}

function loadConfig(dirname, name) {
    let content = (0, _fs.readFileSync)(`${ dirname }${ name }.json`);
    return (0, _parseJsonObjectAsMap2.default)(content);
}

function alpConfig(dirname) {
    let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    dirname = dirname.replace(/\/*$/, '/');

    options = Object.assign({}, options, {
        argv: []
    });

    return app => {
        app.existsConfig = name => existsConfig(dirname, name);
        app.loadConfig = name => loadConfig(dirname, name);

        const config = loadConfig(dirname, 'common');
        for (let _ref of loadConfig(dirname, app.env)) {
            var _ref2 = _slicedToArray(_ref, 2);

            let key = _ref2[0];
            let value = _ref2[1];

            config.set(key, value);
        }

        if (existsConfig(dirname, 'local')) {
            for (let _ref3 of loadConfig(dirname, 'local')) {
                var _ref4 = _slicedToArray(_ref3, 2);

                let key = _ref4[0];
                let value = _ref4[1];

                config.set(key, value);
            }
        }

        if (!config.has('version')) {
            config.set('version', _minimistArgv2.default.version || options.packageConfig.version);
        }

        let socketPath = _minimistArgv2.default['socket-path'] || _minimistArgv2.default.socketPath;
        if (socketPath) {
            config.set('socketPath', socketPath);
        } else if (_minimistArgv2.default.port) {
            config.set('port', _minimistArgv2.default.port);
            config.delete('socketPath');
        }

        options.argv.forEach(key => {
            if (_minimistArgv2.default[key] !== undefined) {
                config.set(key, _minimistArgv2.default[key]);
            }
        });

        app.config = config;
        app.context.config = config;

        return (0, _deepFreezeEs2.default)(config);
    };
}
//# sourceMappingURL=index.js.map