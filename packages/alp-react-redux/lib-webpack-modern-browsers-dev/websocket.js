import Logger from 'nightingale-logger';
import createAction from './createAction';

var logger = new Logger('alp.react-redux.websocket');

export function createEmitAction(type, argsNamesOrHandler) {
    if (!(typeof type === 'string')) {
        throw new TypeError('Value of argument "type" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(type));
    }

    if (!(argsNamesOrHandler == null || Array.isArray(argsNamesOrHandler) && argsNamesOrHandler.every(function (item) {
        return typeof item === 'string';
    }) || typeof argsNamesOrHandler === 'string' || typeof argsNamesOrHandler === 'function')) {
        throw new TypeError('Value of argument "argsNamesOrHandler" violates contract.\n\nExpected:\n?Array<string> | string | Function\n\nGot:\n' + _inspect(argsNamesOrHandler));
    }

    return createAction(type, argsNamesOrHandler, { meta: { websocket: true } });
}

export function createEmitPromiseAction(type, argsNamesOrHandler) {
    if (!(typeof type === 'string')) {
        throw new TypeError('Value of argument "type" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(type));
    }

    if (!(argsNamesOrHandler == null || Array.isArray(argsNamesOrHandler) && argsNamesOrHandler.every(function (item) {
        return typeof item === 'string';
    }) || typeof argsNamesOrHandler === 'string' || typeof argsNamesOrHandler === 'function')) {
        throw new TypeError('Value of argument "argsNamesOrHandler" violates contract.\n\nExpected:\n?Array<string> | string | Function\n\nGot:\n' + _inspect(argsNamesOrHandler));
    }

    return createAction(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}

export var websocketMiddleware = app => {
    return store => {
        return next => {
            return action => {
                if (!action.meta || !action.meta.websocket) {
                    return next(action);
                }

                if (!action.meta.promise) {
                    app.websocket.emit(action.type, action);
                    return;
                }

                var resolved = setTimeout(() => {
                    logger.warn('websocket emit timeout', { action });
                    // eslint-disable-next-line no-console
                    console.log('alp.react-redux websocket emit timeout', action);
                }, 10000);

                app.websocket.emit(action.type, action, action => {
                    clearTimeout(resolved);
                    if (action) {
                        store.dispatch(action);
                    }
                });
            };
        };
    };
};

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
//# sourceMappingURL=websocket.js.map