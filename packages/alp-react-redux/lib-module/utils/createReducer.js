var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* global PRODUCTION */

export default function createReducer(defaultState, handlers) {
  (typeof defaultState === 'undefined' ? 'undefined' : _typeof(defaultState)) === 'object' && (handlers = defaultState, defaultState = function defaultState() {
    return null;
  });


  var handlerMap = new Map();


  return Object.keys(handlers).forEach(function (key) {
    typeof key === 'function' ? handlerMap.set(key.type, handlers[key]) : handlerMap.set(key, handlers[key]);
  }), handlers = void 0, function () {
    var state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : defaultState();
    var action = arguments[1];
    return action && handlerMap.has(action.type) ? handlerMap.get(action.type)(state, action) : state;
  };
}
//# sourceMappingURL=createReducer.js.map