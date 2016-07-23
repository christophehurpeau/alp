var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

import { randomBytes } from 'crypto';
import promiseCallback from 'promise-callback-factory';

export function randomBase64(size) {
    function _ref(_id) {
        if (!(_id instanceof Promise)) {
            throw new TypeError('Function "randomBase64" return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id));
        }

        return _id;
    }

    if (!(typeof size === 'number')) {
        throw new TypeError('Value of argument "size" violates contract.\n\nExpected:\nnumber\n\nGot:\n' + _inspect(size));
    }

    return _ref(promiseCallback(function (done) {
        return randomBytes(size, done);
    }).then(function (buffer) {
        return buffer.toString('base64');
    }));
}

export function randomHex(size) {
    function _ref2(_id2) {
        if (!(_id2 instanceof Promise)) {
            throw new TypeError('Function "randomHex" return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id2));
        }

        return _id2;
    }

    if (!(typeof size === 'number')) {
        throw new TypeError('Value of argument "size" violates contract.\n\nExpected:\nnumber\n\nGot:\n' + _inspect(size));
    }

    return _ref2(promiseCallback(function (done) {
        return randomBytes(size, done);
    }).then(function (buffer) {
        return buffer.toString('hex');
    }));
}

function _inspect(input, depth) {
    var maxDepth = 4;
    var maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === 'undefined' ? 'undefined' : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(function (item) {
                    return _inspect(item, depth) === first;
                })) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(function (item) {
                            return _inspect(item, depth);
                        }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        var indent = '  '.repeat(depth - 1);
        var entries = keys.slice(0, maxKeys).map(function (key) {
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
//# sourceMappingURL=generators.js.map