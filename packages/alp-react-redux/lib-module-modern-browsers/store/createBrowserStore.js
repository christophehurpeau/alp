import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middleware-browser';
import identityReducer from '../utils/identityReducer';

export default (function (app, ctx, moduleReducer, { middlewares, sharedReducers }) {
  const rootReducer = combineReducers(Object.assign({}, app.alpReducers, sharedReducers, {
    ctx: identityReducer,
    module: moduleReducer
  }));

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  return middlewares = [createFunctionMiddleware(app), promiseMiddleware, ...middlewares], createStore(rootReducer, Object.assign({ ctx }, window.__INITIAL_DATA__), composeEnhancers(applyMiddleware(...middlewares)));
});
//# sourceMappingURL=createBrowserStore.js.map