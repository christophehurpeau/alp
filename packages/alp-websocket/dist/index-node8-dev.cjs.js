'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const fs = require('fs');
const socketio = _interopDefault(require('socket.io'));
const Logger = _interopDefault(require('nightingale-logger'));

/* eslint-disable no-use-before-define */
const logger = new Logger('alp:websocket');
let io;

function start(config, dirname) {
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
  const hostname = webSocketConfig.get('hostname'); // eslint-disable-next-line global-require, import/no-dynamic-require

  const createServer = require(secure ? 'https' : 'http').createServer;

  const server = (() => {
    if (!secure) {
      return createServer();
    }

    return createServer({
      key: fs.readFileSync(`${dirname}/server.key`),
      cert: fs.readFileSync(`${dirname}/server.crt`)
    });
  })();

  logger.info('Creating server', socketPath ? {
    socketPath
  } : {
    port
  });
  return new Promise(resolve => {
    if (socketPath) {
      try {
        fs.unlinkSync(socketPath);
      } catch (err) {}

      server.listen(socketPath, () => {
        if (socketPath) {
          fs.chmodSync(socketPath, '777');
        }

        logger.info('Server listening', {
          socketPath
        });
        resolve(io);
      });
    } else {
      server.listen(port, hostname, () => {
        logger.info('Server listening', {
          port
        });
        resolve(io);
      });
    }

    server.on('error', err => logger.error(err));
    io = socketio(server);
    io.on('connection', socket => {
      logger.debug('connected', {
        id: socket.id
      });
      socket.emit('hello', {
        version: config.get('version')
      });
      socket.on('error', err => logger.error(err));
      socket.on('disconnect', () => {
        logger.debug('disconnected', {
          id: socket.id
        });
      });
    });
    io.on('error', err => logger.error(err));
  });
}

function close() {
  io.close();
}
/**
 * @param {Koa|AlpNodeApp} app
 * @param {string} [dirname] for tls, dirname of server.key server.crt. If undefined: app.certPath
 */

function alpWebsocket(app, dirname) {
  // @ts-ignore
  start(app.config, dirname || app.certPath);
  const appWithWebsocket = Object.assign(app, {
    websocket: io
  });
  app.on('close', close);
  return appWithWebsocket;
}
function subscribe(socket, name, callbackOnSubscribe, callbackOnUnsubscribe) {
  const diconnect = callbackOnUnsubscribe && (() => callbackOnUnsubscribe());

  socket.on(`subscribe:${name}`, callback => {
    logger.info('join', {
      name
    });
    socket.join(name);

    if (callbackOnSubscribe) {
      callback(null, callbackOnSubscribe());
    } else {
      callback(null);
    }

    if (diconnect) socket.on('disconnect', diconnect);
  });
  socket.on(`unsubscribe:${name}`, callback => {
    logger.info('leave', {
      name
    });
    socket.leave(name);
    if (diconnect) socket.removeListener('disconnect', diconnect);

    if (callbackOnUnsubscribe) {
      callback(null, callbackOnUnsubscribe());
    } else {
      callback(null);
    }
  });
}

exports.close = close;
exports.default = alpWebsocket;
exports.subscribe = subscribe;
//# sourceMappingURL=index-node8-dev.cjs.js.map
