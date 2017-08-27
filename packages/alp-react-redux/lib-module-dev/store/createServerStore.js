import { combineReducers, createStore } from 'redux';
import identityReducer from '../utils/identityReducer';

export default (function createServerStore(ctx, moduleReducers, _ref) {
  var sharedReducers = _ref.sharedReducers;

  var initialContext = Object.assign({
    ctx: ctx
  }, ctx.reduxInitialContext, {
    ctx: ctx
  });

  var rootReducer = combineReducers(Object.assign({}, ctx.app.reduxReducers, sharedReducers, {
    ctx: identityReducer,
    module: moduleReducers ? combineReducers(moduleReducers) : identityReducer
  }));

  return createStore(rootReducer, initialContext);
});
//# sourceMappingURL=createServerStore.js.map