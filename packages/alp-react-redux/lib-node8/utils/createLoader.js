"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createLoader;
/* global PRODUCTION */
function createLoader(handlers) {
  const handlerMap = new Map(Object.keys(handlers).map(key => [key, handlers[key]]));


  return handlers = void 0, (state, data) => {
    const keys = Object.keys(data);
    return Promise.all(keys.map(key => {
      const handler = handlerMap.get(key);

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