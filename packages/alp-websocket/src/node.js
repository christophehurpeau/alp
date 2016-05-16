import { readFileSync } from 'fs';
import socketio from 'socket.io';
import Logger from 'nightingale-logger';

const logger = new Logger('alp.websocket');

let io;

/**
 * @param {Koa} app
 * @param {string} dirname for tls server, dirname of the server.key and server.crt
 */
export default function alpWebsocket(app, dirname) {
    start(app.config, dirname || `${app.dirname}/../config/cert`);
    app.websocket = io;

    return io;
}

function start(config, dirname) {
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
            key: readFileSync(`${dirname}/server.key`),
            cert: readFileSync(`${dirname}/server.crt`),
        };

        return createServer(options);
    })();

    logger.info('Starting', { port });
    server.listen(port, () => logger.info('Listening', { port }));
    server.on('error', logger.error);
    io = socketio(server);

    io.on('connection', socket => {
        logger.info('connected', { id: socket.id });
        socket.emit('hello', { version: config.get('version') });

        socket.on('disconnect', () => {
            logger.info('disconnected', { id: socket.id });
        });
    });

    io.on('error', logger.error);

    return io;
}
