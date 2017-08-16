/* eslint-disable no-use-before-define */
import socketio from 'socket.io-client';
import Logger from 'nightingale-logger';

import _t from 'flow-runtime';
var logger = new Logger('alp:websocket');
var socket = void 0;
var successfulConnection = null;
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

var WEBSOCKET_STATE_ACTION_TYPE = 'alp:websocket/state';

export default function alpWebsocket(app, namespaceName) {
  return app.alpReducers || (app.alpReducers = {}), app.alpReducers.websocket = function (state, action) {
    if (!state) state = 'disconnected', setTimeout(function () {
        successfulConnection !== false && app.store.dispatch({
          type: WEBSOCKET_STATE_ACTION_TYPE,
          state: connected ? 'connected' : 'connecting'
        });
      });else if (action.type === WEBSOCKET_STATE_ACTION_TYPE) return action.state;
    return state;
  }, start(app, namespaceName), app.websocket = websocket, websocket.socket = socket, socket;
}

function start(app) {
  var namespaceName = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '';
  var config = app.config,
      context = app.context;


  if (socket) throw new Error('WebSocket already started');

  var webSocketConfig = config.get('webSocket') || config.get('websocket');

  if (!webSocketConfig) throw new Error('Missing config webSocket');

  if (!webSocketConfig.has('port')) throw new Error('Missing config webSocket.port');

  var secure = webSocketConfig.get('secure');
  var port = webSocketConfig.get('port');

  socket = socketio('http' + (secure ? 's' : '') + '://' + location.hostname + ':' + port + '/' + namespaceName, {
    reconnectionDelay: 500,
    reconnectionDelayMax: 2500,
    timeout: 4000,
    transports: ['websocket']
  });


  var callbackFirstConnectionError = function callbackFirstConnectionError() {
    return successfulConnection = false;
  };

  return socket.on('connect_error', callbackFirstConnectionError), socket.on('connect', function () {
    socket.off('connect_error', callbackFirstConnectionError), logger.success('connected'), successfulConnection = true, connected = true, app.store && app.store.dispatch({ type: WEBSOCKET_STATE_ACTION_TYPE, state: 'connected' });
  }), socket.on('reconnect', function () {
    logger.success('reconnected'), connected = true, app.store && app.store.dispatch({ type: WEBSOCKET_STATE_ACTION_TYPE, state: 'connected' });
  }), socket.on('disconnect', function () {
    logger.warn('disconnected'), connected = false, app.store && app.store.dispatch({ type: WEBSOCKET_STATE_ACTION_TYPE, state: 'disconnected' });
  }), socket.on('hello', function (_ref) {
    var version = _ref.version;

    if (version !== window.VERSION) {
      // eslint-disable-next-line no-alert
      if (process.env.NODE_ENV === 'production' && confirm(context.t('newversion'))) return location.reload(true);
      console.warn('Version mismatch', { serverVersion: version, clientVersion: window.VERSION });
    }
  }), socket;
}

function emit() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];

  var _returnType = _t.return(_t.any());

  return logger.debug('emit', { args: args }), new Promise(function (resolve, reject) {
    var _socket;

    var resolved = setTimeout(function () {
      logger.warn('websocket emit timeout', { args: args }), reject(new Error('websocket response timeout'));
    }, 10000);

    (_socket = socket).emit.apply(_socket, args.concat([function (error, result) {
      return clearTimeout(resolved), error == null ? void resolve(result) : reject(typeof error === 'string' ? new Error(error) : error);
    }]));
  }).then(function (_arg) {
    return _returnType.assert(_arg);
  });
}

function on(type, handler) {
  return socket.on(type, handler), handler;
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