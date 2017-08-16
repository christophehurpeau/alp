/* eslint-disable no-use-before-define */
import socketio from 'socket.io-client';
import Logger from 'nightingale-logger';

import _t from 'flow-runtime';
const logger = new Logger('alp:websocket');
let socket;
let successfulConnection = null;
let connected = false;

export const websocket = {
  get connected() {
    return connected;
  },
  on,
  off,
  emit,
  isConnected,
  isDisconnected
};

const WEBSOCKET_STATE_ACTION_TYPE = 'alp:websocket/state';

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

function start(app, namespaceName = '') {
  const { config, context } = app;

  if (socket) throw new Error('WebSocket already started');

  const webSocketConfig = config.get('webSocket') || config.get('websocket');

  if (!webSocketConfig) throw new Error('Missing config webSocket');

  if (!webSocketConfig.has('port')) throw new Error('Missing config webSocket.port');

  const secure = webSocketConfig.get('secure');
  const port = webSocketConfig.get('port');

  socket = socketio(`http${secure ? 's' : ''}://${location.hostname}:${port}/${namespaceName}`, {
    reconnectionDelay: 500,
    reconnectionDelayMax: 2500,
    timeout: 4000,
    transports: ['websocket']
  });


  const callbackFirstConnectionError = function callbackFirstConnectionError() {
    return successfulConnection = false;
  };

  return socket.on('connect_error', callbackFirstConnectionError), socket.on('connect', function () {
    socket.off('connect_error', callbackFirstConnectionError), logger.success('connected'), successfulConnection = true, connected = true, app.store && app.store.dispatch({ type: WEBSOCKET_STATE_ACTION_TYPE, state: 'connected' });
  }), socket.on('reconnect', function () {
    logger.success('reconnected'), connected = true, app.store && app.store.dispatch({ type: WEBSOCKET_STATE_ACTION_TYPE, state: 'connected' });
  }), socket.on('disconnect', function () {
    logger.warn('disconnected'), connected = false, app.store && app.store.dispatch({ type: WEBSOCKET_STATE_ACTION_TYPE, state: 'disconnected' });
  }), socket.on('hello', function ({ version }) {
    if (version !== window.VERSION) {
      // eslint-disable-next-line no-alert
      if (process.env.NODE_ENV === 'production' && confirm(context.t('newversion'))) return location.reload(true);
      console.warn('Version mismatch', { serverVersion: version, clientVersion: window.VERSION });
    }
  }), socket;
}

function emit(...args) {
  const _returnType = _t.return(_t.any());

  return logger.debug('emit', { args }), new Promise(function (resolve, reject) {
    const resolved = setTimeout(function () {
      logger.warn('websocket emit timeout', { args }), reject(new Error('websocket response timeout'));
    }, 10000);

    socket.emit(...args, function (error, result) {
      return clearTimeout(resolved), error == null ? void resolve(result) : reject(typeof error === 'string' ? new Error(error) : error);
    });
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