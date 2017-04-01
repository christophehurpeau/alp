/* eslint-disable no-use-before-define */
import socketio from 'socket.io-client';
import Logger from 'nightingale-logger';

import _t from 'flow-runtime';
var logger = new Logger('alp:websocket');
var socket = void 0;
var successfulConnection = false;
var connected = false;

export var websocket = {
  get connected() {
    return connected;
  },
  on: on,
  off: off,
  emit: emit,
  isConnected: isConnected,
  isDisconnected: isDisconnected
};

export default function alpWebsocket(app, namespaceName) {
  start(app, namespaceName);
  app.websocket = websocket;
  websocket.socket = socket;
  return socket;
}

function start(_ref) {
  var config = _ref.config,
      context = _ref.context;
  var namespaceName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (socket) {
    throw new Error('WebSocket already started');
  }

  var webSocketConfig = config.get('webSocket') || config.get('websocket');

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
    reconnectionDelayMax: 2500,
    timeout: 4000,
    transports: ['websocket']
  });

  socket.on('connect', function () {
    logger.success('connected');
    successfulConnection = true;
    connected = true;
  });

  socket.on('reconnect', function () {
    logger.success('reconnected');
    connected = true;
  });

  socket.on('disconnect', function () {
    logger.warn('disconnected');
    connected = false;
  });

  socket.on('hello', function (_ref2) {
    var version = _ref2.version;

    if (version !== window.VERSION) {
      // eslint-disable-next-line no-alert
      if (process.env.NODE_ENV === 'production' && confirm(context.t('newversion'))) {
        return location.reload(true);
      } else {
        console.warn('Version mismatch', { serverVersion: version, clientVersion: window.VERSION });
      }
    }
  });

  return socket;
}

function emit() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _returnType = _t.return(_t.any());

  logger.debug('emit', { args: args });
  return new Promise(function (resolve, reject) {
    var _socket;

    var resolved = setTimeout(function () {
      logger.warn('websocket emit timeout', { args: args });
      reject(new Error('websocket response timeout'));
    }, 10000);

    (_socket = socket).emit.apply(_socket, args.concat([function (error, result) {
      clearTimeout(resolved);
      if (error != null) return reject(typeof error === 'string' ? new Error(error) : error);
      resolve(result);
    }]));
  }).then(function (_arg) {
    return _returnType.assert(_arg);
  });
}

function on(type, handler) {
  socket.on(type, handler);
  return handler;
}

function off(type, handler) {
  socket.off(type, handler);
}

function isConnected() {
  // socket.connected is not updated after reconnect event
  return socket && connected;
}

function isDisconnected() {
  return successfulConnection && !isConnected();
}
//# sourceMappingURL=browser.js.map