function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middleware-browser';
import identityReducer from '../utils/identityReducer';

export default (function createBrowserStore(app, ctx, moduleReducer, _ref) {
  var middlewares = _ref.middlewares,
      sharedReducers = _ref.sharedReducers;

  var reducers = Object.assign({}, app.reduxReducers, sharedReducers, {
    ctx: identityReducer,
    module: moduleReducer
  });

  Object.keys(reducers).forEach(function (key) {
    if (typeof reducers[key] !== 'function') throw new Error('Invalid reducer ' + key);
  });


  var rootReducer = combineReducers(reducers);

  var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  middlewares = [createFunctionMiddleware(app), promiseMiddleware].concat(_toConsumableArray(app.reduxMiddlewares), _toConsumableArray(middlewares));

  return createStore(rootReducer, Object.assign({ ctx: ctx }, window.__INITIAL_DATA__), composeEnhancers(applyMiddleware.apply(undefined, _toConsumableArray(middlewares))));
});
//# sourceMappingURL=createBrowserStore.js.map