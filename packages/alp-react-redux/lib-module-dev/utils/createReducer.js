var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import t from 'flow-runtime';
/* global PRODUCTION */

export default function createReducer(defaultState, handlers) {
  var _defaultStateType = t.union(t.function(), t.object());

  var _handlersType = t.nullable(t.object());

  t.param('defaultState', _defaultStateType).assert(defaultState);
  t.param('handlers', _handlersType).assert(handlers);

  if ((typeof defaultState === 'undefined' ? 'undefined' : _typeof(defaultState)) === 'object') {
    handlers = _handlersType.assert(defaultState);
    defaultState = _defaultStateType.assert(function () {
      return null;
    });
  }

  var handlerMap = new Map();
  Object.keys(handlers).forEach(function (key) {
    if (typeof key === 'function') {
      if (typeof key.type !== 'string') {
        throw new Error('Invalid handler key: "' + key.name + '"');
      }
      handlerMap.set(key.type, handlers[key]);
    } else {
      handlerMap.set(key, handlers[key]);
    }
  });
  handlers = _handlersType.assert(undefined);

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