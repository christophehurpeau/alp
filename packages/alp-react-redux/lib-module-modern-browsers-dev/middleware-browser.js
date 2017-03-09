export const promiseMiddleware = function promiseMiddleware(store) {
  return function (next) {
    return function (action) {
      if (typeof action.then !== 'function') {
        return next(action);
      }

      return Promise.resolve(action).then(store.dispatch);
    };
  };
};

export const createFunctionMiddleware = function createFunctionMiddleware(app) {
  return function (store) {
    return function (next) {
      return function (action) {
        if (typeof action !== 'function') {
          return next(action);
        }

        return action(store.dispatch, app);
      };
    };
  };
};
//# sourceMappingURL=middleware-browser.js.map