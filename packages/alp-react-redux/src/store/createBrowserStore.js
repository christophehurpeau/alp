import { createStore, applyMiddleware, compose, combineReducers } from 'redux/src';
import { promiseMiddleware, createFunctionMiddleware } from './middleware-browser';
import identityReducer from '../utils/identityReducer';

export default (app, ctx, moduleReducer, { middlewares, sharedReducers }) => {
  const rootReducer = combineReducers({
    ...app.alpReducers,
    ...sharedReducers,
    ctx: identityReducer,
    module: moduleReducer,
  });

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  middlewares = [createFunctionMiddleware(app), promiseMiddleware, ...middlewares];

  return createStore(
    rootReducer,
    { ctx, ...window.__INITIAL_DATA__ },
    composeEnhancers(applyMiddleware(...middlewares)),
  );
};
