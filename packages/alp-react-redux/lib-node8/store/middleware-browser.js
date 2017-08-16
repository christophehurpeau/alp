'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const promiseMiddleware = exports.promiseMiddleware = store => next => action => typeof action.then === 'function' ? Promise.resolve(action).then(store.dispatch) : next(action);

const createFunctionMiddleware = exports.createFunctionMiddleware = app => store => next => action => typeof action === 'function' ? action(store.dispatch, app) : next(action);
//# sourceMappingURL=middleware-browser.js.map