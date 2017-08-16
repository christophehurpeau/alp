import Logger from 'nightingale-logger';
import createAction from './utils/createAction';

import t from 'flow-runtime';
const logger = new Logger('alp:react-redux:websocket');

const ArgsNamesOfHandlerType = t.type('ArgsNamesOfHandlerType', t.union(t.array(t.string()), t.string(), t.function()));


export function createEmitAction(type, argsNamesOrHandler) {
  let _typeType = t.string();

  let _argsNamesOrHandlerType = t.nullable(ArgsNamesOfHandlerType);

  return t.param('type', _typeType).assert(type), t.param('argsNamesOrHandler', _argsNamesOrHandlerType).assert(argsNamesOrHandler), createAction(type, argsNamesOrHandler, { meta: { websocket: true } });
}

export function createEmitPromiseAction(type, argsNamesOrHandler) {
  let _typeType2 = t.string();

  let _argsNamesOrHandlerType2 = t.union(t.nullable(t.array(t.string())), t.string(), t.function());

  return t.param('type', _typeType2).assert(type), t.param('argsNamesOrHandler', _argsNamesOrHandlerType2).assert(argsNamesOrHandler), createAction(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}

export const websocketMiddleware = function websocketMiddleware(app) {
  return function (store) {
    return function (next) {
      return function (action) {
        if (!action.meta || !action.meta.websocket) return next(action);

        if (!action.meta.promise) return void app.websocket.emit(action.type, action);

        const resolved = setTimeout(function () {
          logger.warn('websocket emit timeout', { action }), console.log('alp.react-redux websocket emit timeout', action);
        }, 10000);

        app.websocket.emit(action.type, action, function (action) {
          clearTimeout(resolved), action && store.dispatch(action);
        });
      };
    };
  };
};
//# sourceMappingURL=websocket.js.map