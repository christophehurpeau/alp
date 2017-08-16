/* global PRODUCTION */
export default function createLoader(handlers) {
  const handlerMap = new Map(Object.keys(handlers).map(function (key) {
    return [key, handlers[key]];
  }));


  return handlers = void 0, function (state, data) {
    const keys = Object.keys(data);
    return Promise.all(keys.map(function (key) {
      const handler = handlerMap.get(key);

      return handler(state, data[key]);
    })).then(function (results) {
      const data = Object.create(null);

      return results.forEach(function (result, index) {
        data[keys[index]] = result;
      }), data;
    });
  };
}
//# sourceMappingURL=createLoader.js.map