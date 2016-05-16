'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = alpWebsocket;

var _socket2 = require('socket.io-client');

var _socket3 = _interopRequireDefault(_socket2);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _nightingaleLogger2.default('alp.websocket');
var socket = void 0;

/**
 * @function
 * @param app
*/function alpWebsocket(app) {
    start(app.config);
    app.websocket = {
        socket: socket,
        on: on,
        off: off,
        emit: emit
    };

    return socket;
}

/**
 * @function
 * @param config
*/function start(config) {
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

    socket = (0, _socket3.default)('http' + (secure ? 's' : '') + '://' + location.hostname + ':' + port + '/', {
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

/**
 * @function
 * @param {...*} args
*/function emit() {
    var _socket;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    logger.debug('emit', { args: args });
    return (_socket = socket).emit.apply(_socket, args);
}

/**
 * @function
 * @param type
 * @param handler
*/function on(type, handler) {
    socket.on(type, handler);
    return handler;
}

/**
 * @function
 * @param type
 * @param handler
*/function off(type, handler) {
    socket.off(type, handler);
}
//# sourceMappingURL=browser.js.map