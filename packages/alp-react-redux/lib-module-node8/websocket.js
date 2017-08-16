import Logger from 'nightingale-logger';
import createAction from './utils/createAction';

const logger = new Logger('alp:react-redux:websocket');

export function createEmitAction(type, argsNamesOrHandler) {
  return createAction(type, argsNamesOrHandler, { meta: { websocket: true } });
}

export function createEmitPromiseAction(type, argsNamesOrHandler) {
  return createAction(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}

export const websocketMiddleware = app => store => next => action => {
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