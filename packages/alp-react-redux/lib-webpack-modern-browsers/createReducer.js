/* global PRODUCTION */

export default function createReducer(defaultState, handlers) {
  if (typeof defaultState === 'object') {
    handlers = defaultState;
    defaultState = () => null;
  }

  var handlerMap = new Map();
  Object.keys(handlers).forEach(key => {
    if (typeof key === 'function') {
      handlerMap.set(key.type, handlers[key]);
    } else {
      handlerMap.set(key, handlers[key]);
    }
  });
  handlers = undefined;

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState();
    var action = arguments[1];

    if (action && handlerMap.has(action.type)) {
      return handlerMap.get(action.type)(state, action);
    }

    return state;
  };
}
//# sourceMappingURL=createReducer.js.map