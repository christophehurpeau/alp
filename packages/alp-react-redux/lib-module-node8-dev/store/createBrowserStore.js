import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middleware-browser';
import identityReducer from '../utils/identityReducer';

export default (function createBrowserStore(app, ctx, moduleReducer, { middlewares, sharedReducers }) {
  const reducers = Object.assign({}, app.reduxReducers, sharedReducers, {
    ctx: identityReducer,
    module: moduleReducer
  });

  Object.keys(reducers).forEach(key => {
    if (typeof reducers[key] !== 'function') throw new Error(`Invalid reducer ${key}`);
  });


  const rootReducer = combineReducers(reducers);

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  middlewares = [createFunctionMiddleware(app), promiseMiddleware, ...app.reduxMiddlewares, ...middlewares];

  return createStore(rootReducer, Object.assign({ ctx }, window.__INITIAL_DATA__), composeEnhancers(applyMiddleware(...middlewares)));
});
//# sourceMappingURL=createBrowserStore.js.map