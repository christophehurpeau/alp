import socketio from 'socket.io-client';
import { ConsoleLogger, LogLevel } from 'nightingale';

const logger = new ConsoleLogger('alp-websocket', LogLevel.INFO);
let socket;

export default function alpWebsocket(app) {
    start(app.config);
    app.websocket = {
        socket,
        on,
        off,
        emit,
    };

    return socket;
}

function start(config) {
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

    socket = socketio(`http${secure ? 's' : ''}://${location.hostname}:${port}/`, {
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

function emit(...args) {
    logger.debug('emit', { args });
    return socket.emit(...args);
}

function on(type, handler) {
    socket.on(type, handler);
    return handler;
}

function off(type, handler) {
    socket.off(type, handler);
}
