import { createStore, applyMiddleware, compose, combineReducers } from 'redux/src';
import identityReducer from '../utils/identityReducer';
import { promiseMiddleware, createFunctionMiddleware } from './middleware-browser';

export default (app, ctx, moduleReducer, { middlewares, sharedReducers }) => {
  const reducers = {
    ...app.reduxReducers,
    ...sharedReducers,
    ctx: identityReducer,
    module: moduleReducer,
  };

  if (!PRODUCTION) {
    Object.keys(reducers).forEach(key => {
      if (typeof reducers[key] !== 'function') throw new Error(`Invalid reducer ${key}`);
    });
  }

  const rootReducer = combineReducers(reducers);

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  middlewares = [
    createFunctionMiddleware(app),
    promiseMiddleware,
    ...app.reduxMiddlewares,
    ...middlewares,
  ];

  return createStore(
    rootReducer,
    { ctx, ...window.__INITIAL_DATA__ },
    composeEnhancers(applyMiddleware(...middlewares)),
  );
};
