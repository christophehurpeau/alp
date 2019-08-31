import socketio from 'socket.io-client';
import Logger from 'nightingale-logger';

/* eslint-disable no-use-before-define, @typescript-eslint/no-use-before-define, max-lines */
const logger = new Logger('alp:websocket');
let socket;
let successfulConnection = null;
let connected = false;
const websocket = {
  get connected() {
    return connected;
  },

  on,
  off,
  emit,
  isConnected,
  isDisconnected,
  socket
};

function start(app, namespaceName) {
  const {
    config,
    context
  } = app;

  if (socket) {
    throw new Error('WebSocket already started');
  }

  const webSocketConfig = config.get('webSocket') || config.get('websocket');

  if (!webSocketConfig) {
    throw new Error('Missing config webSocket');
  }

  if (!webSocketConfig.has('port')) {
    throw new Error('Missing config webSocket.port');
  }

  const secure = webSocketConfig.get('secure');
  const port = webSocketConfig.get('port');
  socket = socketio(`http${secure ? 's' : ''}://${window.location.hostname}:${port}/${namespaceName}`, {
    reconnectionDelay: 500,
    reconnectionDelayMax: 2500,
    timeout: 4000,
    transports: ['websocket']
  });

  const callbackFirstConnectionError = function callbackFirstConnectionError() {
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
  socket.on('hello', function ({
    version
  }) {
    if (version !== window.__VERSION__) {
      // eslint-disable-next-line no-alert
      if (window.confirm(context.t('newversion'))) {
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
    logger.debug('dispatch action from websocket', action); // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore

    app.store.dispatch(action);
  });
  return socket;
}

function emit(event, ...args) {
  if (!socket) throw new Error('Cannot call emit() before start()');
  logger.debug('emit', {
    args
  });
  return new Promise(function (resolve, reject) {
    const resolved = setTimeout(function () {
      logger.warn('websocket emit timeout', {
        args
      });
      reject(new Error('websocket response timeout'));
    }, 10000);
    socket.emit(event, ...args, function (error, result) {
      clearTimeout(resolved);

      if (error != null) {
        return reject(typeof error === 'string' ? new Error(error) : error);
      }

      resolve(result);
    });
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

function alpWebsocket(app, namespaceName = '') {
  const socket = start(app, namespaceName);
  app.websocket = websocket;
  websocket.socket = socket;
  return socket;
}

export default alpWebsocket;
export { websocket };
//# sourceMappingURL=index-browsermodern.es.js.map
