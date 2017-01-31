import Logger from 'nightingale-logger';
import createAction from './utils/createAction';

const logger = new Logger('alp:react-redux:websocket');

export function createEmitAction(type, argsNamesOrHandler) {
  return createAction(type, argsNamesOrHandler, { meta: { websocket: true } });
}

export function createEmitPromiseAction(type, argsNamesOrHandler) {
  return createAction(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}

export const websocketMiddleware = function websocketMiddleware(app) {
  return function (store) {
    return function (next) {
      return function (action) {
        if (!action.meta || !action.meta.websocket) {
          return next(action);
        }

        if (!action.meta.promise) {
          app.websocket.emit(action.type, action);
          return;
        }

        const resolved = setTimeout(function () {
          logger.warn('websocket emit timeout', { action });
          // eslint-disable-next-line no-console
          console.log('alp.react-redux websocket emit timeout', action);
        }, 10000);

        app.websocket.emit(action.type, action, function (action) {
          clearTimeout(resolved);
          if (action) {
            store.dispatch(action);
          }
        });
      };
    };
  };
};
//# sourceMappingURL=websocket.js.map