'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createLoader;
/* global PRODUCTION */
function createLoader(defaultState, handlers) {
  if (typeof defaultState === 'object') {
    handlers = defaultState;
    defaultState = () => ({});
  }

  const handlerMap = new Map(Object.keys(handlers).map(key => [key, handlers[key]]));
  handlers = undefined;

  return function () {
    let state = arguments.length <= 0 || arguments[0] === undefined ? defaultState() : arguments[0];
    let data = arguments[1];

    const keys = Object.keys(data);
    return Promise.all(keys.map(key => {
      const handler = handlerMap.get(key);

      return handler(state, data[key]);
    })).then(results => {
      results.forEach((result, index) => {
        state[keys[index]] = result;
      });
      return state;
    });
  };
}
//# sourceMappingURL=createLoader.js.map