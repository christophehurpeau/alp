import t from "flow-runtime";
/* global PRODUCTION */
export default function createLoader(handlers) {
  var _handlersType = t.nullable(t.object());

  t.param("handlers", _handlersType).assert(handlers);

  var handlerMap = new Map(Object.keys(handlers).map(function (key) {
    return [key, handlers[key]];
  }));


  return handlers = _handlersType.assert(void 0), function (state, data) {
    var keys = Object.keys(data);
    return Promise.all(keys.map(function (key) {
      var handler = handlerMap.get(key);
      if (!handler) throw new Error("Missing handler for \"" + key + "\".");
      return handler(state, data[key]);
    })).then(function (results) {
      var data = Object.create(null);

      return results.forEach(function (result, index) {
        data[keys[index]] = result;
      }), data;
    });
  };
}
//# sourceMappingURL=createLoader.js.map