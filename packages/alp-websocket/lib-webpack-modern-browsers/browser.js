import socketio from 'socket.io-client';
import Logger from 'nightingale-logger';

var logger = new Logger('alp.websocket');
var socket = undefined;

export default function alpWebsocket(app, namespaceName) {
    start(app.config, namespaceName);
    app.websocket = {
        socket,
        on,
        off,
        emit
    };

    return socket;
}

function start(config, namespaceName = '') {
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

    socket.on('hello', ({ version }) => {
        if (version !== window.VERSION) {
            return location.reload(true);
        }
    });

    return socket;
}

function emit(...args) {
    logger.debug('emit', { args });
    return new Promise((resolve, reject) => {
        var resolved = setTimeout(() => {
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
//# sourceMappingURL=browser.js.map