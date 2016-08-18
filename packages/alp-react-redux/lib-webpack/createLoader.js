var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/* global PRODUCTION */
export default function createLoader(defaultState, handlers) {
  if ((typeof defaultState === 'undefined' ? 'undefined' : _typeof(defaultState)) === 'object') {
    handlers = defaultState;
    defaultState = function defaultState() {
      return {};
    };
  }

  var handlerMap = new Map(Object.keys(handlers).map(function (key) {
    return [key, handlers[key]];
  }));
  handlers = undefined;

  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState() : arguments[0];
    var data = arguments[1];

    var keys = Object.keys(data);
    return Promise.all(keys.map(function (key) {
      var handler = handlerMap.get(key);

      return handler(state, data[key]);
    })).then(function (results) {
      results.forEach(function (result, index) {
        state[keys[index]] = result;
      });
      return state;
    });
  };
}
//# sourceMappingURL=createLoader.js.map