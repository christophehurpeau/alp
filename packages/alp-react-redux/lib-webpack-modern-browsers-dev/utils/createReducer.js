import _t from 'tcomb-forked';
/* global PRODUCTION */

export default function createReducer(defaultState, handlers) {
  _assert(defaultState, _t.union([_t.Function, _t.Object]), 'defaultState');

  _assert(handlers, _t.maybe(_t.Object), 'handlers');

  if (typeof defaultState === 'object') {
    handlers = defaultState;
    defaultState = function defaultState() {
      return null;
    };
  }

  var handlerMap = new Map();
  Object.keys(handlers).forEach(function (key) {
    if (typeof key === 'function') {
      if (typeof key.type !== 'string') {
        throw new Error(`Invalid handler key: "${ key.name }"`);
      }
      handlerMap.set(key.type, handlers[key]);
    } else {
      handlerMap.set(key, handlers[key]);
    }
  });
  handlers = undefined;

  return function (state = defaultState(), action) {
    if (action && handlerMap.has(action.type)) {
      return handlerMap.get(action.type)(state, action);
    }

    return state;
  };
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=createReducer.js.map