'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import argv from 'minimist-argv';
import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import { existsSync, readFileSync } from 'fs';

function existsConfig(dirname, name) {
    return existsSync(`${ dirname }${ name }.json`);
}

function loadConfig(dirname, name) {
    var content = readFileSync(`${ dirname }${ name }.json`);
    return parseJSON(content);
}

export default function alpConfig(dirname) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    dirname = dirname.replace(/\/*$/, '/');

    options = Object.assign({}, options, {
        argv: []
    });

    return app => {
        app.existsConfig = name => existsConfig(dirname, name);
        app.loadConfig = name => loadConfig(dirname, name);

        var config = loadConfig(dirname, 'common');
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = loadConfig(dirname, app.env)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

        if (existsConfig(dirname, 'local')) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = loadConfig(dirname, 'local')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
            config.set('version', argv.version || options.packageConfig.version);
        }

        var socketPath = argv['socket-path'] || argv.socketPath;
        if (socketPath) {
            config.set('socketPath', socketPath);
        } else if (argv.port) {
            config.set('port', argv.port);
            config.delete('socketPath');
        }

        options.argv.forEach(key => {
            if (argv[key] !== undefined) {
                config.set(key, argv[key]);
            }
        });

        app.config = config;
        app.context.config = config;

        return deepFreeze(config);
    };
}
//# sourceMappingURL=index.js.map