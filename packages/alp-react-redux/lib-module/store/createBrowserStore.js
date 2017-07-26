function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middleware-browser';

export default (function (app, moduleReducer, _ref) {
  var middlewares = _ref.middlewares,
      sharedReducers = _ref.sharedReducers;

  var rootReducer = combineReducers(Object.assign({}, app.alpReducers, sharedReducers, {
    module: moduleReducer
  }));

  var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  middlewares = [createFunctionMiddleware(app), promiseMiddleware].concat(_toConsumableArray(middlewares));

  return createStore(rootReducer, window.__INITIAL_DATA__, composeEnhancers(applyMiddleware.apply(undefined, _toConsumableArray(middlewares))));
});
//# sourceMappingURL=createBrowserStore.js.map