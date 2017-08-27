import t from 'flow-runtime';
/* global PRODUCTION */

export default function createReducer(defaultState, handlers) {
  let _defaultStateType = t.union(t.function(), t.object());

  let _handlersType = t.nullable(t.object());

  t.param('defaultState', _defaultStateType).assert(defaultState);
  t.param('handlers', _handlersType).assert(handlers);

  if (typeof defaultState === 'object') {
    handlers = _handlersType.assert(defaultState);
    defaultState = _defaultStateType.assert(function () {
      return null;
    });
  }

  const handlerMap = new Map();
  Object.keys(handlers).forEach(function (key) {
    if (typeof key === 'function') {
      if (typeof key.type !== 'string') {
        throw new Error(`Invalid handler key: "${key.name}"`);
      }
      handlerMap.set(key.type, handlers[key]);
    } else {
      handlerMap.set(key, handlers[key]);
    }
  });
  handlers = _handlersType.assert(undefined);

  return function (state = defaultState(), action) {
    if (action && handlerMap.has(action.type)) {
      return handlerMap.get(action.type)(state, action);
    }

    return state;
  };
}
//# sourceMappingURL=createReducer.js.map