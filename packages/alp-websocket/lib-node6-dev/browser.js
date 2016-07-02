'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = alpWebsocket;

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp.websocket');
let socket;

function alpWebsocket(app, namespaceName) {
    start(app.config, namespaceName);
    app.websocket = {
        socket,
        on,
        off,
        emit,
        isConnected
    };

    return socket;
}

function start(config) {
    let namespaceName = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    if (socket) {
        throw new Error('WebSocket already started');
    }

    const webSocketConfig = config.get('webSocket');

    if (!webSocketConfig) {
        throw new Error('Missing config webSocket');
    }

    if (!webSocketConfig.has('port')) {
        throw new Error('Missing config webSocket.port');
    }

    const secure = webSocketConfig.get('secure');
    const port = webSocketConfig.get('port');

    socket = (0, _socket2.default)(`http${ secure ? 's' : '' }://${ location.hostname }:${ port }/${ namespaceName }`, {
        reconnectionDelay: 500,
        reconnectionDelayMax: 1000,
        timeout: 4000,
        transports: ['websocket']
    });

    socket.on('connect', () => {
        logger.success('connected');
    });

    socket.on('disconnect', () => {
        logger.warn('disconnected');
    });

    socket.on('hello', _ref => {
        let version = _ref.version;

        if (version !== window.VERSION) {
            return location.reload(true);
        }
    });

    return socket;
}

function emit() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    logger.debug('emit', { args });
    return new Promise((resolve, reject) => {
        const resolved = setTimeout(() => {
            logger.warn('websocket emit timeout', { args });
            reject('timeout');
        }, 10000);

        socket.emit(...args, result => {
            clearTimeout(resolved);
            resolve(result);
        });
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