'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.websocketMiddleware = void 0;
exports.createEmitAction = createEmitAction;
exports.createEmitPromiseAction = createEmitPromiseAction;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _createAction = require('./utils/createAction');

var _createAction2 = _interopRequireDefault(_createAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp:react-redux:websocket');

function createEmitAction(type, argsNamesOrHandler) {
  return (0, _createAction2.default)(type, argsNamesOrHandler, { meta: { websocket: true } });
}

function createEmitPromiseAction(type, argsNamesOrHandler) {
  return (0, _createAction2.default)(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}

const websocketMiddleware = exports.websocketMiddleware = app => store => next => action => {
  if (!action.meta || !action.meta.websocket) return next(action);

  if (!action.meta.promise) return void app.websocket.emit(action.type, action);

  const resolved = setTimeout(() => {
    logger.warn('websocket emit timeout', { action }), console.log('alp.react-redux websocket emit timeout', action);
  }, 10000);

  app.websocket.emit(action.type, action, action => {
    clearTimeout(resolved), action && store.dispatch(action);
  });
};
//# sourceMappingURL=websocket.js.map