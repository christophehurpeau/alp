import { combineReducers, createStore } from 'redux';
import identityReducer from '../utils/identityReducer';

export default (function createServerStore(ctx, moduleReducer, { sharedReducers }) {
  // TODO create new API ?
  const initialContext = ctx.computeInitialContextForBrowser().state;
  const keys = Object.keys(initialContext);
  const initialContextReducers = Object.create(null);
  keys.forEach(function (key) {
    return initialContextReducers[key] = identityReducer;
  });

  const rootReducer = combineReducers(Object.assign({}, initialContextReducers, ctx.app.alpReducers, sharedReducers, {
    module: moduleReducer
  }));

  return createStore(rootReducer, initialContext);
});
//# sourceMappingURL=createServerStore.js.map