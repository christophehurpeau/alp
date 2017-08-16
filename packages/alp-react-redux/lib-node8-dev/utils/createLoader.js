"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createLoader;

var _flowRuntime = require("flow-runtime");

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global PRODUCTION */
function createLoader(handlers) {
  let _handlersType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

  _flowRuntime2.default.param("handlers", _handlersType).assert(handlers);

  const handlerMap = new Map(Object.keys(handlers).map(key => [key, handlers[key]]));


  return handlers = _handlersType.assert(void 0), (state, data) => {
    const keys = Object.keys(data);
    return Promise.all(keys.map(key => {
      const handler = handlerMap.get(key);
      if (!handler) throw new Error(`Missing handler for "${key}".`);
      return handler(state, data[key]);
    })).then(results => {
      const data = Object.create(null);

      return results.forEach((result, index) => {
        data[keys[index]] = result;
      }), data;
    });
  };
}
//# sourceMappingURL=createLoader.js.map