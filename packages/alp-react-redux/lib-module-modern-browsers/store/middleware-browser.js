export const promiseMiddleware = function promiseMiddleware(store) {
  return function (next) {
    return function (action) {
      return typeof action.then === 'function' ? Promise.resolve(action).then(store.dispatch) : next(action);
    };
  };
};

export const createFunctionMiddleware = function createFunctionMiddleware(app) {
  return function (store) {
    return function (next) {
      return function (action) {
        return typeof action === 'function' ? action(store.dispatch, app) : next(action);
      };
    };
  };
};
//# sourceMappingURL=middleware-browser.js.map