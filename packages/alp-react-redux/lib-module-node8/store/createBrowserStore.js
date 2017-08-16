var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]); } return target; };

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middleware-browser';
import identityReducer from '../utils/identityReducer';

export default ((app, ctx, moduleReducer, { middlewares, sharedReducers }) => {
  const rootReducer = combineReducers(_extends({}, app.alpReducers, sharedReducers, {
    ctx: identityReducer,
    module: moduleReducer
  }));

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  return middlewares = [createFunctionMiddleware(app), promiseMiddleware, ...middlewares], createStore(rootReducer, _extends({ ctx }, window.__INITIAL_DATA__), composeEnhancers(applyMiddleware(...middlewares)));
});
//# sourceMappingURL=createBrowserStore.js.map