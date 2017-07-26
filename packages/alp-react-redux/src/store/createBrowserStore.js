import { createStore, applyMiddleware, compose, combineReducers } from 'redux/src';
import { promiseMiddleware, createFunctionMiddleware } from './middleware-browser';

export default (app, moduleReducer, { middlewares, sharedReducers }) => {
  const rootReducer = combineReducers({
    ...app.alpReducers,
    ...sharedReducers,
    module: moduleReducer,
  });

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  middlewares = [createFunctionMiddleware(app), promiseMiddleware, ...middlewares];

  return createStore(
    rootReducer,
    window.__INITIAL_DATA__,
    composeEnhancers(applyMiddleware(...middlewares)),
  );
};
