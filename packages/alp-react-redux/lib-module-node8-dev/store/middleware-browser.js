export const promiseMiddleware = store => next => action => typeof action.then === 'function' ? Promise.resolve(action).then(store.dispatch) : next(action);

export const createFunctionMiddleware = app => store => next => action => typeof action === 'function' ? action(store.dispatch, app) : next(action);
//# sourceMappingURL=middleware-browser.js.map