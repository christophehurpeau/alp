import Logger from 'nightingale-logger';
import createAction from './utils/createAction';

import t from 'flow-runtime';
const logger = new Logger('alp:react-redux:websocket');

export function createEmitAction(type, argsNamesOrHandler) {
  let _typeType = t.string();

  let _argsNamesOrHandlerType = t.union(t.nullable(t.array(t.string())), t.string(), t.function());

  t.param('type', _typeType).assert(type);
  t.param('argsNamesOrHandler', _argsNamesOrHandlerType).assert(argsNamesOrHandler);

  return createAction(type, argsNamesOrHandler, { meta: { websocket: true } });
}

export function createEmitPromiseAction(type, argsNamesOrHandler) {
  let _typeType2 = t.string();

  let _argsNamesOrHandlerType2 = t.union(t.nullable(t.array(t.string())), t.string(), t.function());

  t.param('type', _typeType2).assert(type);
  t.param('argsNamesOrHandler', _argsNamesOrHandlerType2).assert(argsNamesOrHandler);

  return createAction(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}

export const websocketMiddleware = app => store => next => action => {
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