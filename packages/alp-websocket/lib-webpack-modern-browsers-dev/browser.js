import _t from 'tcomb-forked';
/* global location, window, confirm */
/* eslint-disable no-use-before-define */
import socketio from 'socket.io-client';
import Logger from 'nightingale-logger';

var logger = new Logger('alp:websocket');
var socket = void 0;
var successfulConnection = false;
var connected = false;

export var websocket = {
  get connected() {
    return connected;
  },
  on,
  off,
  emit,
  isConnected,
  isDisconnected
};

export default function alpWebsocket(app, namespaceName) {
  start(app, namespaceName);
  app.websocket = websocket;
  websocket.socket = socket;
  return socket;
}

function start({ config, context }, namespaceName = '') {
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

  socket = socketio(`http${ secure ? 's' : '' }://${ location.hostname }:${ port }/${ namespaceName }`, {
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

  socket.on('hello', function ({ version }) {
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

function emit(...args) {
  return _assert(function () {
    logger.debug('emit', { args });
    return new Promise(function (resolve, reject) {
      var resolved = setTimeout(function () {
        logger.warn('websocket emit timeout', { args });
        reject(new Error('websocket response timeout'));
      }, 10000);

      socket.emit(...args, function (error, result) {
        clearTimeout(resolved);
        if (error != null) return reject(typeof error === 'string' ? new Error(error) : error);
        resolve(result);
      });
    });
  }.apply(this, arguments), _t.Promise, 'return value');
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

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=browser.js.map