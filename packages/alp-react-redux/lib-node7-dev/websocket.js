'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.websocketMiddleware = undefined;
exports.createEmitAction = createEmitAction;
exports.createEmitPromiseAction = createEmitPromiseAction;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _createAction = require('./utils/createAction');

var _createAction2 = _interopRequireDefault(_createAction);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp:react-redux:websocket');

const ArgsNamesOfHandlerType = _flowRuntime2.default.type('ArgsNamesOfHandlerType', _flowRuntime2.default.union(_flowRuntime2.default.array(_flowRuntime2.default.string()), _flowRuntime2.default.string(), _flowRuntime2.default.function()));

function createEmitAction(type, argsNamesOrHandler) {
  let _typeType = _flowRuntime2.default.string();

  let _argsNamesOrHandlerType = _flowRuntime2.default.nullable(ArgsNamesOfHandlerType);

  _flowRuntime2.default.param('type', _typeType).assert(type);

  _flowRuntime2.default.param('argsNamesOrHandler', _argsNamesOrHandlerType).assert(argsNamesOrHandler);

  return (0, _createAction2.default)(type, argsNamesOrHandler, { meta: { websocket: true } });
}

function createEmitPromiseAction(type, argsNamesOrHandler) {
  let _typeType2 = _flowRuntime2.default.string();

  let _argsNamesOrHandlerType2 = _flowRuntime2.default.union(_flowRuntime2.default.nullable(_flowRuntime2.default.array(_flowRuntime2.default.string())), _flowRuntime2.default.string(), _flowRuntime2.default.function());

  _flowRuntime2.default.param('type', _typeType2).assert(type);

  _flowRuntime2.default.param('argsNamesOrHandler', _argsNamesOrHandlerType2).assert(argsNamesOrHandler);

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
//# sourceMappingURL=websocket.js.map