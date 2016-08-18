'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.websocketMiddleware = undefined;
exports.createEmitAction = createEmitAction;
exports.createEmitPromiseAction = createEmitPromiseAction;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _createAction = require('./createAction');

var _createAction2 = _interopRequireDefault(_createAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp.react-redux.websocket');

function createEmitAction(type, argsNamesOrHandler) {
  return (0, _createAction2.default)(type, argsNamesOrHandler, { meta: { websocket: true } });
}

function createEmitPromiseAction(type, argsNamesOrHandler) {
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