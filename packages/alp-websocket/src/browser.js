/* global location, window, confirm */
import socketio from 'socket.io-client';
import Logger from 'nightingale-logger';

const logger = new Logger('alp.websocket');
let socket;
let successfullConnection = false;
let connected = false;

export const websocket = {
  get socket() { return socket; },
  get connected() { return connected; },
  on,
  off,
  emit,
  isConnected,
  isDisconnected,
};

export default function alpWebsocket(app, namespaceName) {
  start(app, namespaceName);
  app.websocket = socket;
  return socket;
}

function start({ config, context }, namespaceName = '') {
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

  socket = socketio(`http${secure ? 's' : ''}://${location.hostname}:${port}/${namespaceName}`, {
    reconnectionDelay: 500,
    reconnectionDelayMax: 2500,
    timeout: 4000,
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    logger.success('connected');
    successfullConnection = true;
    connected = true;
  });

  socket.on('reconnect', () => {
    logger.success('reconnected');
    connected = true;
  });

  socket.on('disconnect', () => {
    logger.warn('disconnected');
    connected = false;
  });

  socket.on('hello', ({ version }) => {
    if (version !== window.VERSION) {
      // eslint-disable-next-line no-alert
      if (process.env.NODE_ENV !== 'production' || confirm(context.t('newversion'))) {
        return location.reload(true);
      }
    }
  });

  return socket;
}

function emit(...args): Promise {
  logger.debug('emit', { args });
  return new Promise((resolve, reject) => {
    const resolved = setTimeout(() => {
      logger.warn('websocket emit timeout', { args });
      reject(new Error('websocket response timeout'));
    }, 10000);

    socket.emit(...args, (error, result) => {
      clearTimeout(resolved);
      if (error != null) return reject(error);
      resolve(result);
    });
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
  return successfullConnection && !isConnected();
}
