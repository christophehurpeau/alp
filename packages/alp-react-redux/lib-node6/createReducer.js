'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createReducer;
/* global PRODUCTION */

function createReducer(defaultState, handlers) {
  if (typeof defaultState === 'object') {
    handlers = defaultState;
    defaultState = () => null;
  }

  const handlerMap = new Map();
  Object.keys(handlers).forEach(key => {
    if (typeof key === 'function') {
      handlerMap.set(key.type, handlers[key]);
    } else {
      handlerMap.set(key, handlers[key]);
    }
  });
  handlers = undefined;

  return function () {
    let state = arguments.length <= 0 || arguments[0] === undefined ? defaultState() : arguments[0];
    let action = arguments[1];

    if (action && handlerMap.has(action.type)) {
      return handlerMap.get(action.type)(state, action);
    }

    return state;
  };
}
//# sourceMappingURL=createReducer.js.map