import Logger from 'nightingale-logger';
import createAction from './utils/createAction';

import t from 'flow-runtime';
var logger = new Logger('alp:react-redux:websocket');

var ArgsNamesOfHandlerType = t.type('ArgsNamesOfHandlerType', t.union(t.array(t.string()), t.string(), t.function()));


export function createEmitAction(type, argsNamesOrHandler) {
  var _typeType = t.string();

  var _argsNamesOrHandlerType = t.nullable(ArgsNamesOfHandlerType);

  t.param('type', _typeType).assert(type);
  t.param('argsNamesOrHandler', _argsNamesOrHandlerType).assert(argsNamesOrHandler);

  return createAction(type, argsNamesOrHandler, { meta: { websocket: true } });
}

export function createEmitPromiseAction(type, argsNamesOrHandler) {
  var _typeType2 = t.string();

  var _argsNamesOrHandlerType2 = t.union(t.nullable(t.array(t.string())), t.string(), t.function());

  t.param('type', _typeType2).assert(type);
  t.param('argsNamesOrHandler', _argsNamesOrHandlerType2).assert(argsNamesOrHandler);

  return createAction(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}

export var websocketMiddleware = function websocketMiddleware(app) {
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

        var resolved = setTimeout(function () {
          logger.warn('websocket emit timeout', { action: action });
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