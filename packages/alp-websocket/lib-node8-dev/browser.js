'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.websocket = void 0;
exports.default = alpWebsocket;

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp:websocket'); /* eslint-disable no-use-before-define */

let socket;
let successfulConnection = null;
let connected = false;

const websocket = exports.websocket = {
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

function alpWebsocket(app, namespaceName) {
  return app.alpReducers || (app.alpReducers = {}), app.alpReducers.websocket = (state, action) => {
    if (!state) state = 'disconnected', setTimeout(() => {
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

  socket = (0, _socket2.default)(`http${secure ? 's' : ''}://${location.hostname}:${port}/${namespaceName}`, {
    reconnectionDelay: 500,
    reconnectionDelayMax: 2500,
    timeout: 4000,
    transports: ['websocket']
  });


  const callbackFirstConnectionError = () => successfulConnection = false;

  return socket.on('connect_error', callbackFirstConnectionError), socket.on('connect', () => {
    socket.off('connect_error', callbackFirstConnectionError), logger.success('connected'), successfulConnection = true, connected = true, app.store && app.store.dispatch({ type: WEBSOCKET_STATE_ACTION_TYPE, state: 'connected' });
  }), socket.on('reconnect', () => {
    logger.success('reconnected'), connected = true, app.store && app.store.dispatch({ type: WEBSOCKET_STATE_ACTION_TYPE, state: 'connected' });
  }), socket.on('disconnect', () => {
    logger.warn('disconnected'), connected = false, app.store && app.store.dispatch({ type: WEBSOCKET_STATE_ACTION_TYPE, state: 'disconnected' });
  }), socket.on('hello', ({ version }) => {
    if (version !== window.VERSION) {
      // eslint-disable-next-line no-alert
      if (process.env.NODE_ENV === 'production' && confirm(context.t('newversion'))) return location.reload(true);
      console.warn('Version mismatch', { serverVersion: version, clientVersion: window.VERSION });
    }
  }), socket;
}

function emit(...args) {
  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.any());

  return logger.debug('emit', { args }), new Promise((resolve, reject) => {
    const resolved = setTimeout(() => {
      logger.warn('websocket emit timeout', { args }), reject(new Error('websocket response timeout'));
    }, 10000);

    socket.emit(...args, (error, result) => (clearTimeout(resolved), error == null ? void resolve(result) : reject(typeof error === 'string' ? new Error(error) : error)));
  }).then(_arg => _returnType.assert(_arg));
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