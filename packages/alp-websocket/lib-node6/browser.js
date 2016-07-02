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
//# sourceMappingURL=browser.js.map