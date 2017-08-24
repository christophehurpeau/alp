import { combineReducers, createStore } from 'redux';
import identityReducer from '../utils/identityReducer';

export default (function createServerStore(ctx, moduleReducers, { sharedReducers }) {
  // TODO create new API ?
  const initialContext = ctx.computeInitialContextForBrowser().state;
  const keys = Object.keys(initialContext);
  const initialContextReducers = Object.create(null);
  keys.forEach(key => initialContextReducers[key] = identityReducer), initialContext.ctx = ctx;


  const rootReducer = combineReducers(Object.assign({}, initialContextReducers, ctx.app.alpReducers, sharedReducers, {
    ctx: identityReducer,
    module: moduleReducers ? combineReducers(moduleReducers) : identityReducer
  }));

  return createStore(rootReducer, initialContext);
});
//# sourceMappingURL=createServerStore.js.map