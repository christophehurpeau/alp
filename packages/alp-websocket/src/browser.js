import socketio from 'socket.io-client';
import Logger from 'nightingale-logger';

const logger = new Logger('alp.websocket');
let socket;

export default function alpWebsocket(app, namespaceName) {
    start(app.config, namespaceName);
    app.websocket = {
        socket,
        on,
        off,
        emit,
        isConnected,
    };

    return socket;
}

function start(config, namespaceName = '') {
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

    socket = socketio(`http${secure ? 's' : ''}://${location.hostname}:${port}/${namespaceName}`, {
        reconnectionDelay: 500,
        reconnectionDelayMax: 1000,
        timeout: 4000,
        transports: ['websocket'],
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

function emit(...args): Promise {
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
