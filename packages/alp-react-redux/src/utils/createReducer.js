/* global PRODUCTION */

export default function createReducer(defaultState: Function | Object, handlers: ?Object) {
  if (typeof defaultState === 'object') {
    handlers = defaultState;
    defaultState = () => null;
  }

  const handlerMap = new Map();
  Object.keys(handlers).forEach((key) => {
    if (typeof key === 'function') {
      if (!PRODUCTION && typeof key.type !== 'string') {
        throw new Error(`Invalid handler key: "${key.name}"`);
      }
      handlerMap.set(key.type, handlers[key]);
    } else {
      handlerMap.set(key, handlers[key]);
    }
  });
  handlers = undefined;

  return (state = defaultState(), action) => {
    if (action && handlerMap.has(action.type)) {
      return handlerMap.get(action.type)(state, action);
    }

    return state;
  };
}
