/* global location, window, confirm */
import socketio from 'socket.io-client';
import Logger from 'nightingale-logger';

var logger = new Logger('alp.websocket');
var socket = undefined;

export default function alpWebsocket(app, namespaceName) {
    start(app, namespaceName);
    app.websocket = {
        socket,
        on,
        off,
        emit,
        isConnected
    };

    return socket;
}

function start(_ref) {
    var config = _ref.config;
    var context = _ref.context;
    var namespaceName = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    if (socket) {
        throw new Error('WebSocket already started');
    }

    var webSocketConfig = config.get('webSocket');

    if (!webSocketConfig) {
        throw new Error('Missing config webSocket');
    }

    if (!webSocketConfig.has('port')) {
        throw new Error('Missing config webSocket.port');
    }

    var secure = webSocketConfig.get('secure');
    var port = webSocketConfig.get('port');

    socket = socketio(`http${ secure ? 's' : '' }://${ location.hostname }:${ port }/${ namespaceName }`, {
        reconnectionDelay: 500,
        reconnectionDelayMax: 2500,
        timeout: 4000,
        transports: ['websocket']
    });

    socket.on('connect', () => {
        logger.success('connected');
    });

    socket.on('disconnect', () => {
        logger.warn('disconnected');
    });

    socket.on('hello', _ref2 => {
        var version = _ref2.version;

        if (version !== window.VERSION) {
            // eslint-disable-next-line no-alert
            if (!true /*defines: PRODUCTION = true*/ || confirm(context.t('newversion'))) {
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

    logger.debug('emit', { args });
    return new Promise((resolve, reject) => {
        var resolved = setTimeout(() => {
            logger.warn('websocket emit timeout', { args });
            reject('timeout');
        }, 10000);

        socket.emit(...args, (error, result) => {
            clearTimeout(resolved);
            if (error != null) return reject(error);
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