export const promiseMiddleware = store => next => action => {
  if (typeof action.then !== 'function') {
    return next(action);
  }

  return Promise.resolve(action).then(store.dispatch);
};

export const createFunctionMiddleware = app => store => next => action => {
  if (typeof action !== 'function') {
    return next(action);
  }

  return action(store.dispatch, app);
};
