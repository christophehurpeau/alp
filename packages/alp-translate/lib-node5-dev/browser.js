'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = alpTranslate;

var _load = require('./load');

var _load2 = _interopRequireDefault(_load);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function alpTranslate(dirname) {
    dirname = dirname.replace(/\/*$/, '/');
    return app => {
        Object.assign(app.context, {
            t: function t(key, args) {
                function _t(_id) {
                    if (!(typeof _id === 'string')) {
                        throw new TypeError('Function return value violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(_id));
                    }

                    return _id;
                }

                if (!(typeof key === 'string')) {
                    throw new TypeError('Value of argument "key" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(key));
                }

                if (!(args == null || args instanceof Object)) {
                    throw new TypeError('Value of argument "args" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(args));
                }

                const msg = app.translations.get(key);
                if (!msg) return key;
                return _t(msg.format(args));
            }
        });

        const language = app.context.language;
        return app.loadConfig(dirname + language).then(map => {
            return app.translations = (0, _load2.default)(map, language);
        });
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
//# sourceMappingURL=browser.js.map