'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = alpWebsocket;

var _fs = require('fs');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp.websocket');

let io;

/**
 * @param {Koa} app
 * @param {string} dirname for tls server, dirname of the server.key and server.crt
 */
/**
 * @function
 * @param app
 * @param dirname
*/function alpWebsocket(app, dirname) {
    start(app.config, dirname || `${ app.dirname }/../config/cert`);
    app.websocket = io;

    return io;
}

/**
 * @function
 * @param config
 * @param dirname
*/function start(config, dirname) {
    if (io) {
        throw new Error('Already started');
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
    const createServer = require(secure ? 'https' : 'http').createServer;

    const server = (() => {
        if (!secure) {
            return createServer();
        }

        const options = {
            key: (0, _fs.readFileSync)(`${ dirname }/server.key`),
            cert: (0, _fs.readFileSync)(`${ dirname }/server.crt`)
        };

        return createServer(options);
    })();

    logger.info('Starting', { port: port });
    server.listen(port, () => logger.info('Listening', { port: port }));
    server.on('error', logger.error);
    io = (0, _socket2.default)(server);

    io.on('connection', socket => {
        logger.debug('connected', { id: socket.id });
        socket.emit('hello', { version: config.get('version') });

        socket.on('disconnect', () => {
            logger.debug('disconnected', { id: socket.id });
        });
    });

    io.on('error', logger.error);

    return io;
}
//# sourceMappingURL=node.js.map