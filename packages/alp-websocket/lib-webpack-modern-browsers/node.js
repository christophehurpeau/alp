import { readFileSync } from 'fs';
import socketio from 'socket.io';
import Logger from 'nightingale-logger';

var logger = new Logger('alp.websocket');

var io = undefined;

/**
 * @param {Koa} app
 * @param {string} dirname for tls server, dirname of the server.key and server.crt
 */
export default function alpWebsocket(app, dirname) {
    start(app.config, dirname);
    app.websocket = io;

    return io;
}

export function subscribe(socket, name, callbackOnSubscribe) {
    socket.on(`subscribe:${ name }`, callback => {
        logger.info('join', { name });
        socket.join(name);

        if (callbackOnSubscribe) {
            callback(callbackOnSubscribe());
        } else {
            callback();
        }
    });

    socket.on(`unsubscribe:${ name }`, callback => {
        logger.info('leave', { name });
        socket.leave(name);
        callback();
    });
}

function start(config, dirname) {
    if (io) {
        throw new Error('Already started');
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
    // eslint-disable-next-line global-require
    var createServer = require(secure ? 'https' : 'http').createServer;

    var server = (() => {
        if (!secure) {
            return createServer();
        }

        return createServer({
            key: readFileSync(`${ dirname }/server.key`),
            cert: readFileSync(`${ dirname }/server.crt`)
        });
    })();

    logger.info('Starting', { port });
    server.listen(port, () => logger.info('Listening', { port }));
    server.on('error', logger.error);
    io = socketio(server);

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