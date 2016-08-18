export var promiseMiddleware = store => {
  return next => {
    return action => {
      if (typeof action.then !== 'function') {
        return next(action);
      }

      return Promise.resolve(action).then(store.dispatch);
    };
  };
};

export var createFunctionMiddleware = app => {
  return store => {
    return next => {
      return action => {
        if (typeof action !== 'function') {
          return next(action);
        }

        return action(store.dispatch, app);
      };
    };
  };
};
//# sourceMappingURL=middlewares.js.map