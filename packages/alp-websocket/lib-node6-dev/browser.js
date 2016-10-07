'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.websocket = undefined;
exports.default = alpWebsocket;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global location, window, confirm */
const logger = new _nightingaleLogger2.default('alp.websocket');
let socket;
let successfulConnection = false;
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

function alpWebsocket(app, namespaceName) {
  start(app, namespaceName);
  app.websocket = websocket;
  websocket.socket = socket;
  return socket;
}

function start(_ref) {
  let config = _ref.config;
  let context = _ref.context;
  let namespaceName = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

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

  socket = (0, _socket2.default)(`http${ secure ? 's' : '' }://${ location.hostname }:${ port }/${ namespaceName }`, {
    reconnectionDelay: 500,
    reconnectionDelayMax: 2500,
    timeout: 4000,
    transports: ['websocket']
  });

  socket.on('connect', () => {
    logger.success('connected');
    successfulConnection = true;
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

  socket.on('hello', _ref2 => {
    let version = _ref2.version;

    if (version !== window.VERSION) {
      // eslint-disable-next-line no-alert
      if (process.env.NODE_ENV !== 'production' || confirm(context.t('newversion'))) {
        return location.reload(true);
      }
    }
  });

  return socket;
}

function emit() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _assert(function () {
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
  }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
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
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }

    return type(x);
  }

  if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=browser.js.map