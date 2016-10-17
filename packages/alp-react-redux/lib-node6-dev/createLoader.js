"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createLoader;

var _tcombForked = require("tcomb-forked");

var _tcombForked2 = _interopRequireDefault(_tcombForked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global PRODUCTION */
function createLoader(handlers) {
  _assert(handlers, _tcombForked2.default.maybe(_tcombForked2.default.Object), "handlers");

  const handlerMap = new Map(Object.keys(handlers).map(key => [key, handlers[key]]));
  handlers = undefined;

  return (state, data) => {
    const keys = Object.keys(data);
    return Promise.all(keys.map(key => {
      const handler = handlerMap.get(key);
      if (!handler) throw new Error(`Missing handler for "${ key }".`);
      return handler(state, data[key]);
    })).then(results => {
      const data = Object.create(null);
      results.forEach((result, index) => {
        data[keys[index]] = result;
      });
      return data;
    });
  };
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=createLoader.js.map