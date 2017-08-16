import t from "flow-runtime";
/* global PRODUCTION */
export default function createLoader(handlers) {
  let _handlersType = t.nullable(t.object());

  t.param("handlers", _handlersType).assert(handlers);

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