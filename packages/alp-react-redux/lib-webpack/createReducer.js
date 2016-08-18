var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/* global PRODUCTION */

export default function createReducer(defaultState, handlers) {
  if ((typeof defaultState === 'undefined' ? 'undefined' : _typeof(defaultState)) === 'object') {
    handlers = defaultState;
    defaultState = function defaultState() {
      return null;
    };
  }

  var handlerMap = new Map();
  Object.keys(handlers).forEach(function (key) {
    if (typeof key === 'function') {
      handlerMap.set(key.type, handlers[key]);
    } else {
      handlerMap.set(key, handlers[key]);
    }
  });
  handlers = undefined;

  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState() : arguments[0];
    var action = arguments[1];

    if (action && handlerMap.has(action.type)) {
      return handlerMap.get(action.type)(state, action);
    }

    return state;
  };
}
//# sourceMappingURL=createReducer.js.map