export default function createReducer(defaultState, handlers) {
    if (!(typeof defaultState === 'function' || defaultState instanceof Object)) {
        throw new TypeError('Value of argument "defaultState" violates contract.\n\nExpected:\nFunction | Object\n\nGot:\n' + _inspect(defaultState));
    }

    if (!(handlers == null || handlers instanceof Object)) {
        throw new TypeError('Value of argument "handlers" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(handlers));
    }

    if (typeof defaultState === 'object') {
        handlers = defaultState;
        defaultState = () => {
            return null;
        };
    }

    var handlerMap = new Map();
    Object.keys(handlers).forEach(key => {
        if (typeof key === 'function') {
            if (typeof key.type !== 'string') {
                throw new Error(`Invalid handler key: "${ key.name }"`);
            }
            handlerMap.set(key.type, handlers[key]);
        } else {
            handlerMap.set(key, handlers[key]);
        }
    });

    return (state = defaultState(), action) => {
        if (action && handlerMap.has(action.type)) {
            return handlerMap.get(action.type)(state, action);
        }

        return state;
    };
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
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(item => _inspect(item, depth) === first)) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if (typeof _ret === "object") return _ret.v;
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
        var entries = keys.slice(0, maxKeys).map(key => {
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
//# sourceMappingURL=createReducer.js.map