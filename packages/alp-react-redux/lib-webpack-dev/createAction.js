var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

export default function createAction(type, argsNamesOrHandler, data) {
    if (!(typeof type === 'string')) {
        throw new TypeError('Value of argument "type" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(type));
    }

    if (!(argsNamesOrHandler == null || Array.isArray(argsNamesOrHandler) && argsNamesOrHandler.every(function (item) {
        return typeof item === 'string';
    }) || typeof argsNamesOrHandler === 'string' || typeof argsNamesOrHandler === 'function')) {
        throw new TypeError('Value of argument "argsNamesOrHandler" violates contract.\n\nExpected:\n?Array<string> | string | Function\n\nGot:\n' + _inspect(argsNamesOrHandler));
    }

    if (!(data == null || data instanceof Object)) {
        throw new TypeError('Value of argument "data" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(data));
    }

    var action = undefined;

    var typeofSecondArg = typeof argsNamesOrHandler === 'undefined' ? 'undefined' : _typeof(argsNamesOrHandler);

    if (typeofSecondArg === 'function') {
        action = function action() {
            return _extends({ type: type }, data, argsNamesOrHandler.apply(undefined, arguments));
        };
    } else {
        if (typeofSecondArg === 'string') {
            argsNamesOrHandler = argsNamesOrHandler.split(',');
        }

        if (argsNamesOrHandler) {
            action = function action() {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var action = _extends({ type: type }, data);
                args.forEach(function (value, index) {
                    return action[argsNamesOrHandler[index]] = value;
                });
                return action;
            };
        } else {
            action = function action(args) {
                if (!(args == null || args instanceof Object)) {
                    throw new TypeError('Value of argument "args" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(args));
                }

                return _extends({ type: type }, data, args);
            };
        }
    }

    action.type = type;
    action.toString = function () {
        return type;
    };

    return action;
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
//# sourceMappingURL=createAction.js.map