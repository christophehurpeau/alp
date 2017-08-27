import { combineReducers, createStore } from 'redux/src';
import identityReducer from '../utils/identityReducer';

export default (ctx, moduleReducers, { sharedReducers }) => {
  const initialContext = {
    ctx,
    ...ctx.reduxInitialContext,
  };

  initialContext.ctx = ctx;

  const rootReducer = combineReducers({
    ...ctx.app.reduxReducers,
    ...sharedReducers,
    ctx: identityReducer,
    module: moduleReducers ? combineReducers(moduleReducers) : identityReducer,
  });

  return createStore(rootReducer, initialContext);
};
