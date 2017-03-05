import t from "flow-runtime";
/* global PRODUCTION */
export default function createLoader(handlers) {
  let _handlersType = t.nullable(t.object());

  t.param("handlers", _handlersType).assert(handlers);

  const handlerMap = new Map(Object.keys(handlers).map(function (key) {
    return [key, handlers[key]];
  }));
  handlers = _handlersType.assert(undefined);

  return function (state, data) {
    const keys = Object.keys(data);
    return Promise.all(keys.map(function (key) {
      const handler = handlerMap.get(key);
      if (!handler) throw new Error(`Missing handler for "${key}".`);
      return handler(state, data[key]);
    })).then(function (results) {
      const data = Object.create(null);
      results.forEach(function (result, index) {
        data[keys[index]] = result;
      });
      return data;
    });
  };
}
//# sourceMappingURL=createLoader.js.map