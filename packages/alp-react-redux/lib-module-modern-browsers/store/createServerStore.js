import { combineReducers, createStore } from 'redux';
import identityReducer from '../utils/identityReducer';

export default (function (ctx, moduleReducers, { sharedReducers }) {
  const initialContext = Object.assign({
    ctx
  }, ctx.reduxInitialContext, {
    ctx: ctx
  });

  const rootReducer = combineReducers(Object.assign({}, ctx.app.reduxReducers, sharedReducers, {
    ctx: identityReducer,
    module: moduleReducers ? combineReducers(moduleReducers) : identityReducer
  }));

  return createStore(rootReducer, initialContext);
});
//# sourceMappingURL=createServerStore.js.map