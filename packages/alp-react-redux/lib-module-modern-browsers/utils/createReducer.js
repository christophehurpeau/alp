/* global PRODUCTION */

export default function createReducer(defaultState, handlers) {
  typeof defaultState === 'object' && (handlers = defaultState, defaultState = function defaultState() {
    return null;
  });


  const handlerMap = new Map();


  return Object.keys(handlers).forEach(function (key) {
    typeof key === 'function' ? handlerMap.set(key.type, handlers[key]) : handlerMap.set(key, handlers[key]);
  }), handlers = void 0, function (state = defaultState(), action) {
    return action && handlerMap.has(action.type) ? handlerMap.get(action.type)(state, action) : state;
  };
}
//# sourceMappingURL=createReducer.js.map