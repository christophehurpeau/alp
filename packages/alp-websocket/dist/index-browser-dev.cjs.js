'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var socketio = _interopDefault(require('socket.io-client'));
var Logger = _interopDefault(require('nightingale-logger'));

/* eslint-disable no-use-before-define, @typescript-eslint/no-use-before-define, max-lines */
var logger = new Logger('alp:websocket');
var socket;
var successfulConnection = null;
var connected = false;
var websocket = {
  get connected() {
    return connected;
  },

  on: on,
  off: off,
  emit: emit,
  isConnected: isConnected,
  isDisconnected: isDisconnected,
  socket: socket
};

function start(app, namespaceName) {
  var config = app.config,
      context = app.context;

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
  socket = socketio("http" + (secure ? 's' : '') + "://" + window.location.hostname + ":" + port + "/" + namespaceName, {
    reconnectionDelay: 500,
    reconnectionDelayMax: 2500,
    timeout: 4000,
    transports: ['websocket']
  });

  var callbackFirstConnectionError = function callbackFirstConnectionError() {
    successfulConnection = false;
  };

  socket.on('connect_error', callbackFirstConnectionError);
  socket.on('connect', function () {
    socket.off('connect_error', callbackFirstConnectionError);
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
  socket.on('hello', function (_ref) {
    var version = _ref.version;

    if (version !== window.__VERSION__) {
      // eslint-disable-next-line no-alert
      if (process.env.NODE_ENV === 'production' && window.confirm(context.t('newversion'))) {
        return window.location.reload(true);
      } else {
        console.warn('Version mismatch', {
          serverVersion: version,
          clientVersion: window.__VERSION__
        });
      }
    }
  });
  socket.on('redux:action', function (action) {
    logger.debug('dispatch action from websocket', action); // @ts-ignore

    app.store.dispatch(action);
  });
  return socket;
}

function emit(event) {
  var _len, args, _key;

  for (_len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (!socket) throw new Error('Cannot call emit() before start()');
  logger.debug('emit', {
    args: args
  });
  return new Promise(function (resolve, reject) {
    var _ref2;

    var resolved = setTimeout(function () {
      logger.warn('websocket emit timeout', {
        args: args
      });
      reject(new Error('websocket response timeout'));
    }, 10000);

    (_ref2 = socket).emit.apply(_ref2, [event].concat(args, [function (error, result) {
      clearTimeout(resolved);

      if (error != null) {
        return reject(typeof error === 'string' ? new Error(error) : error);
      }

      resolve(result);
    }]));
  });
}

function on(event, handler) {
  if (!socket) throw new Error('Cannot call on() before start()');
  socket.on(event, handler);
  return handler;
}

function off(event, handler) {
  if (!socket) throw new Error('Cannot call off() before start()');
  socket.off(event, handler);
}

function isConnected() {
  // socket.connected is not updated after reconnect event
  return !!socket && connected;
}

function isDisconnected() {
  return !!successfulConnection && !isConnected();
}

function alpWebsocket(app, namespaceName) {
  if (namespaceName === void 0) {
    namespaceName = '';
  }

  var socket = start(app, namespaceName);
  app.websocket = websocket;
  websocket.socket = socket;
  return socket;
}

exports.websocket = websocket;
exports.default = alpWebsocket;
//# sourceMappingURL=index-browser-dev.cjs.js.map
