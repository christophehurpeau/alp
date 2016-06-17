'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createAction;
function createAction(type, argsNamesOrHandler) {
    if (!(typeof type === 'string')) {
        throw new TypeError('Value of argument "type" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(type));
    }

    if (!(argsNamesOrHandler == null || Array.isArray(argsNamesOrHandler) && argsNamesOrHandler.every(function (item) {
        return typeof item === 'string';
    }) || typeof argsNamesOrHandler === 'string' || typeof argsNamesOrHandler === 'function')) {
        throw new TypeError('Value of argument "argsNamesOrHandler" violates contract.\n\nExpected:\n?Array<string> | string | Function\n\nGot:\n' + _inspect(argsNamesOrHandler));
    }

    let action;

    const typeofSecondArg = typeof argsNamesOrHandler;

    if (typeofSecondArg === 'function') {
        action = function action() {
            return _extends({ type }, argsNamesOrHandler(...arguments));
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

                const action = { type };
                args.forEach((value, index) => {
                    return action[argsNamesOrHandler[index]] = value;
                });
                return action;
            };
        } else {
            action = args => {
                if (!(args == null || args instanceof Object)) {
                    throw new TypeError('Value of argument "args" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(args));
                }

                return _extends({ type }, args);
            };
        }
    }

    action.type = type;
    action.toString = () => {
        return type;
    };

    return action;
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
//# sourceMappingURL=createAction.js.map