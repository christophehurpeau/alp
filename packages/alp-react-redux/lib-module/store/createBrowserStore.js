var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middleware-browser';
import identityReducer from '../utils/identityReducer';

export default (function (app, ctx, moduleReducer, _ref) {
  var middlewares = _ref.middlewares,
      sharedReducers = _ref.sharedReducers;

  var rootReducer = combineReducers(_extends({}, app.alpReducers, sharedReducers, {
    ctx: identityReducer,
    module: moduleReducer
  }));

  var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  middlewares = [createFunctionMiddleware(app), promiseMiddleware].concat(_toConsumableArray(middlewares));

  return createStore(rootReducer, _extends({ ctx: ctx }, window.__INITIAL_DATA__), composeEnhancers(applyMiddleware.apply(undefined, _toConsumableArray(middlewares))));
});
//# sourceMappingURL=createBrowserStore.js.map