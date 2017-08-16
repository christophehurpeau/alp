'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alpWebsocket;
exports.close = close;
exports.subscribe = subscribe;

var _fs = require('fs');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp:websocket'); /* eslint-disable no-use-before-define */


let io;

/**
 * @param {Koa|AlpNodeApp} app
 * @param {string} [dirname] for tls, dirname of server.key server.crt. If undefined: app.certPath
 */
function alpWebsocket(app, dirname) {
  return app.alpReducers || (app.alpReducers = {}), app.alpReducers.websocket = () => 'disconnected', start(app.config, dirname || app.certPath), app.websocket = io, app.on('close', close), io;
}

function close() {
  io.close();
}

function subscribe(socket, name, callbackOnSubscribe, callbackOnUnsubscribe) {
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
    key: (0, _fs.readFileSync)(`${dirname}/server.key`),
    cert: (0, _fs.readFileSync)(`${dirname}/server.crt`)
  }) : createServer())();

  return logger.info('Starting', { port }), server.listen(port, () => logger.info('Listening', { port })), server.on('error', err => logger.error(err)), io = (0, _socket2.default)(server), io.on('connection', socket => {
    logger.debug('connected', { id: socket.id }), socket.emit('hello', { version: config.get('version') }), socket.on('error', err => logger.error(err)), socket.on('disconnect', () => {
      logger.debug('disconnected', { id: socket.id });
    });
  }), io.on('error', err => logger.error(err)), io;
}
//# sourceMappingURL=index.js.map