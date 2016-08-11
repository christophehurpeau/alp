var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/* global location, window, confirm */
import socketio from 'socket.io-client';
import Logger from 'nightingale-logger';

var logger = new Logger('alp.websocket');
var socket = undefined;

export var websocket = {
    on: on,
    off: off,
    emit: emit,
    isConnected: isConnected
};

export default function alpWebsocket(app, namespaceName) {
    start(app, namespaceName);
    websocket.socket = socket;
    return socket;
}

function start(_ref) {
    var config = _ref.config;
    var context = _ref.context;
    var namespaceName = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    if (socket) {
        throw new Error('WebSocket already started');
    }

    var webSocketConfig = config.get('webSocket') || config.get('websocket');

    if (!webSocketConfig) {
        throw new Error('Missing config webSocket');
    }

    if (!webSocketConfig.has('port')) {
        throw new Error('Missing config webSocket.port');
    }

    var secure = webSocketConfig.get('secure');
    var port = webSocketConfig.get('port');

    socket = socketio('http' + (secure ? 's' : '') + '://' + location.hostname + ':' + port + '/' + namespaceName, {
        reconnectionDelay: 500,
        reconnectionDelayMax: 2500,
        timeout: 4000,
        transports: ['websocket']
    });

    socket.on('connect', function () {
        logger.success('connected');
    });

    socket.on('disconnect', function () {
        logger.warn('disconnected');
    });

    socket.on('hello', function (_ref2) {
        var version = _ref2.version;

        if (version !== window.VERSION) {
            // eslint-disable-next-line no-alert
            if (process.env.NODE_ENV !== 'production' || confirm(context.t('newversion'))) {
                return location.reload(true);
            }
        }
    });

    return socket;
}

function emit() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    logger.debug('emit', { args: args });
    return new Promise(function (resolve, reject) {
        var _socket;

        var resolved = setTimeout(function () {
            logger.warn('websocket emit timeout', { args: args });
            reject(new Error('websocket response timeout'));
        }, 10000);

        (_socket = socket).emit.apply(_socket, args.concat([function (error, result) {
            clearTimeout(resolved);
            if (error != null) return reject(error);
            resolve(result);
        }]));
    });
}

function on(type, handler) {
    socket.on(type, handler);
    return handler;
}

function off(type, handler) {
    socket.off(type, handler);
}

function isConnected() {
    return socket && socket.connected;
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
//# sourceMappingURL=browser.js.map