import socketio from 'socket.io-client';
import Logger from 'nightingale-logger';

var logger = new Logger('alp.websocket');
var socket = undefined;

export default function alpWebsocket(app, namespaceName) {
    start(app.config, namespaceName);
    app.websocket = {
        socket: socket,
        on: on,
        off: off,
        emit: emit
    };

    return socket;
}

function start(config) {
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

    socket = socketio('http' + (secure ? 's' : '') + '://' + location.hostname + ':' + port + '/' + namespaceName, {
        reconnectionDelay: 500,
        reconnectionDelayMax: 1000,
        timeout: 4000,
        transports: ['websocket']
    });

    socket.on('connect', function () {
        logger.success('connected');
    });

    socket.on('disconnect', function () {
        logger.warn('disconnected');
    });

    socket.on('hello', function (_ref) {
        var version = _ref.version;

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

    logger.debug('emit', { args: args });
    return new Promise(function (resolve, reject) {
        var _socket;

        var resolved = setTimeout(function () {
            logger.warn('websocket emit timeout', { args: args });
            reject('timeout');
        }, 10000);

        (_socket = socket).emit.apply(_socket, args.concat([function (result) {
            clearTimeout(resolved);
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
//# sourceMappingURL=browser.js.map