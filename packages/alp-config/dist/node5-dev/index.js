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
    if (!(typeof dirname === 'string')) {
        throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dirname));
    }

    if (!(typeof name === 'string')) {
        throw new TypeError('Value of argument "name" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(name));
    }

    return (0, _fs.existsSync)(`${ dirname }${ name }.json`);
}

function loadConfig(dirname, name) {
    if (!(typeof dirname === 'string')) {
        throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dirname));
    }

    if (!(typeof name === 'string')) {
        throw new TypeError('Value of argument "name" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(name));
    }

    let content = (0, _fs.readFileSync)(`${ dirname }${ name }.json`);
    return (0, _parseJsonObjectAsMap2.default)(content);
}

function alpConfig(dirname) {
    let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (!(typeof dirname === 'string')) {
        throw new TypeError('Value of argument "dirname" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dirname));
    }

    if (!(options instanceof Object)) {
        throw new TypeError('Value of argument "options" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(options));
    }

    dirname = dirname.replace(/\/*$/, '/');

    options = Object.assign({}, options, {
        argv: []
    });

    return app => {
        app.existsConfig = name => {
            return existsConfig(dirname, name);
        };
        app.loadConfig = name => {
            return loadConfig(dirname, name);
        };

        const config = loadConfig(dirname, 'common');
        _loadConfig = loadConfig(dirname, app.env);

        if (!(_loadConfig && (typeof _loadConfig[Symbol.iterator] === 'function' || Array.isArray(_loadConfig)))) {
            throw new TypeError('Expected _loadConfig to be iterable, got ' + _inspect(_loadConfig));
        }

        for (let _ref of _loadConfig) {
            var _loadConfig;

            var _ref2 = _slicedToArray(_ref, 2);

            let key = _ref2[0];
            let value = _ref2[1];

            config.set(key, value);
        }

        if (existsConfig(dirname, 'local')) {
            _loadConfig2 = loadConfig(dirname, 'local');

            if (!(_loadConfig2 && (typeof _loadConfig2[Symbol.iterator] === 'function' || Array.isArray(_loadConfig2)))) {
                throw new TypeError('Expected _loadConfig2 to be iterable, got ' + _inspect(_loadConfig2));
            }

            for (let _ref3 of _loadConfig2) {
                var _loadConfig2;

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