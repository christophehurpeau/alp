'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.websocketMiddleware = undefined;
exports.createEmitAction = createEmitAction;
exports.createEmitPromiseAction = createEmitPromiseAction;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _createAction = require('./utils/createAction');

var _createAction2 = _interopRequireDefault(_createAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp:react-redux:websocket');

function createEmitAction(type, argsNamesOrHandler) {
  _assert(type, _tcombForked2.default.String, 'type');

  _assert(argsNamesOrHandler, _tcombForked2.default.union([_tcombForked2.default.maybe(_tcombForked2.default.list(_tcombForked2.default.String)), _tcombForked2.default.String, _tcombForked2.default.Function]), 'argsNamesOrHandler');

  return (0, _createAction2.default)(type, argsNamesOrHandler, { meta: { websocket: true } });
}

function createEmitPromiseAction(type, argsNamesOrHandler) {
  _assert(type, _tcombForked2.default.String, 'type');

  _assert(argsNamesOrHandler, _tcombForked2.default.union([_tcombForked2.default.maybe(_tcombForked2.default.list(_tcombForked2.default.String)), _tcombForked2.default.String, _tcombForked2.default.Function]), 'argsNamesOrHandler');

  return (0, _createAction2.default)(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}

const websocketMiddleware = exports.websocketMiddleware = app => store => next => action => {
  if (!action.meta || !action.meta.websocket) {
    return next(action);
  }

  if (!action.meta.promise) {
    app.websocket.emit(action.type, action);
    return;
  }

  const resolved = setTimeout(() => {
    logger.warn('websocket emit timeout', { action });
    // eslint-disable-next-line no-console
    console.log('alp.react-redux websocket emit timeout', action);
  }, 10000);

  app.websocket.emit(action.type, action, action => {
    clearTimeout(resolved);
    if (action) {
      store.dispatch(action);
    }
  });
};

function _assert(x, type, name) {
  if (false) {
    _tcombForked2.default.fail = function (message) {
      console.warn(message);
    };
  }

  if (_tcombForked2.default.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail('Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=websocket.js.map