'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createReducer;
/* global PRODUCTION */

function createReducer(defaultState, handlers) {
  typeof defaultState === 'object' && (handlers = defaultState, defaultState = () => null);


  const handlerMap = new Map();


  return Object.keys(handlers).forEach(key => {
    typeof key === 'function' ? handlerMap.set(key.type, handlers[key]) : handlerMap.set(key, handlers[key]);
  }), handlers = void 0, (state = defaultState(), action) => action && handlerMap.has(action.type) ? handlerMap.get(action.type)(state, action) : state;
}
//# sourceMappingURL=createReducer.js.map