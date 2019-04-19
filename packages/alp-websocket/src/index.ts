/* eslint-disable no-use-before-define */
import { chmodSync, readFileSync, unlinkSync } from 'fs';
import socketio, { Server, Socket } from 'socket.io';
import Logger from 'nightingale-logger';
import { NodeApplication, NodeConfig } from 'alp-types';

interface NodeApplicationWithWebsocket extends NodeApplication {
  websocket: Server;
}

const logger = new Logger('alp:websocket');

let io: Server;

function start(config: NodeConfig, dirname: string) {
  if (io) {
    throw new Error('Already started');
  }

  const webSocketConfig = config.get('webSocket') || config.get('websocket');

  if (!webSocketConfig) {
    throw new Error('Missing config webSocket');
  }

  if (!webSocketConfig.has('port') && !webSocketConfig.has('socketPath')) {
    throw new Error('Missing config webSocket.port');
  }

  const secure = webSocketConfig.get('secure');
  const socketPath = webSocketConfig.get('socketPath');
  const port = webSocketConfig.get('port');
  const hostname = webSocketConfig.get('hostname');
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const createServer = require(secure ? 'https' : 'http').createServer;

  const server = (() => {
    if (!secure) {
      return createServer();
    }

    return createServer({
      key: readFileSync(`${dirname}/server.key`),
      cert: readFileSync(`${dirname}/server.crt`),
    });
  })();

  logger.info('Creating server', socketPath ? { socketPath } : { port });

  return new Promise((resolve) => {
    if (socketPath) {
      try {
        unlinkSync(socketPath);
      } catch (err) {}

      server.listen(socketPath, () => {
        if (socketPath) {
          chmodSync(socketPath, '777');
        }

        logger.info('Server listening', { socketPath });
        resolve(io);
      });
    } else {
      server.listen(port, hostname, () => {
        logger.info('Server listening', { port });
        resolve(io);
      });
    }

    server.on('error', (err: Error) => logger.error(err));
    io = socketio(server, {
      // https://github.com/socketio/socket.io/issues/3259
      pingTimeout: 30000,
    });

    io.on('connection', (socket) => {
      logger.debug('connected', { id: socket.id });
      socket.emit('hello', { version: config.get('version') });

      socket.on('error', (err) => logger.error(err));
      socket.on('disconnect', () => {
        logger.debug('disconnected', { id: socket.id });
      });
    });

    io.on('error', (err: Error) => logger.error(err));
  });
}

export function close() {
  io.close();
}

/**
 * @param {Koa|AlpNodeApp} app
 * @param {string} [dirname] for tls, dirname of server.key server.crt. If undefined: app.certPath
 */
export default function alpWebsocket(app: NodeApplication, dirname?: string) {
  // @ts-ignore
  start(app.config, dirname || app.certPath);

  const appWithWebsocket: NodeApplicationWithWebsocket = Object.assign(app, {
    websocket: io,
  });

  app.on('close', close);
  return appWithWebsocket;
}

export function subscribe(
  socket: Socket,
  name: string,
  callbackOnSubscribe: () => void,
  callbackOnUnsubscribe: () => void,
) {
  const diconnect = callbackOnUnsubscribe && (() => callbackOnUnsubscribe());
  socket.on(`subscribe:${name}`, (callback) => {
    logger.info('join', { name });
    socket.join(name);

    if (callbackOnSubscribe) {
      callback(null, callbackOnSubscribe());
    } else {
      callback(null);
    }

    if (diconnect) socket.on('disconnect', diconnect);
  });

  socket.on(`unsubscribe:${name}`, (callback) => {
    logger.info('leave', { name });
    socket.leave(name);
    if (diconnect) socket.removeListener('disconnect', diconnect);

    if (callbackOnUnsubscribe) {
      callback(null, callbackOnUnsubscribe());
    } else {
      callback(null);
    }
  });
}
