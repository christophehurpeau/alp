/* eslint-disable no-use-before-define */
import { readFileSync } from 'fs';
import socketio from 'socket.io';
import Logger from 'nightingale-logger';

const logger = new Logger('alp:websocket');

let io;

/**
 * @param {Koa|AlpNodeApp} app
 * @param {string} [dirname] for tls, dirname of server.key server.crt. If undefined: app.certPath
 */
export default function alpWebsocket(app, dirname) {
  return app.alpReducers || (app.alpReducers = {}), app.alpReducers.websocket = () => 'disconnected', start(app.config, dirname || app.certPath), app.websocket = io, app.on('close', close), io;
}

export function close() {
  io.close();
}

export function subscribe(socket, name, callbackOnSubscribe, callbackOnUnsubscribe) {
  const diconnect = callbackOnUnsubscribe && (() => callbackOnUnsubscribe());
  socket.on(`subscribe:${name}`, callback => {
    logger.info('join', { name }), socket.join(name), callbackOnSubscribe ? callback(null, callbackOnSubscribe()) : callback(null), diconnect && socket.on('disconnect', diconnect);
  }), socket.on(`unsubscribe:${name}`, callback => {
    logger.info('leave', { name }), socket.leave(name), diconnect && socket.removeListener('disconnect', diconnect), callbackOnUnsubscribe ? callback(null, callbackOnUnsubscribe()) : callback(null);
  });
}

function start(config, dirname) {
  if (io) throw new Error('Already started');

  const webSocketConfig = config.get('webSocket') || config.get('websocket');

  if (!webSocketConfig) throw new Error('Missing config webSocket');

  if (!webSocketConfig.has('port')) throw new Error('Missing config webSocket.port');

  const secure = webSocketConfig.get('secure');
  const port = webSocketConfig.get('port');
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const createServer = require(secure ? 'https' : 'http').createServer;

  const server = (() => secure ? createServer({
    key: readFileSync(`${dirname}/server.key`),
    cert: readFileSync(`${dirname}/server.crt`)
  }) : createServer())();

  return logger.info('Starting', { port }), server.listen(port, () => logger.info('Listening', { port })), server.on('error', err => logger.error(err)), io = socketio(server), io.on('connection', socket => {
    logger.debug('connected', { id: socket.id }), socket.emit('hello', { version: config.get('version') }), socket.on('error', err => logger.error(err)), socket.on('disconnect', () => {
      logger.debug('disconnected', { id: socket.id });
    });
  }), io.on('error', err => logger.error(err)), io;
}
//# sourceMappingURL=index.js.map