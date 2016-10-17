export var promiseMiddleware = store => next => action => {
  if (typeof action.then !== 'function') {
    return next(action);
  }

  return Promise.resolve(action).then(store.dispatch);
};

export var createFunctionMiddleware = app => store => next => action => {
  if (typeof action !== 'function') {
    return next(action);
  }

  return action(store.dispatch, app);
};
//# sourceMappingURL=middlewares-browser.js.map