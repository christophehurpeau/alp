import { combineReducers, createStore } from 'redux';
import identityReducer from '../utils/identityReducer';

export default (function (ctx, moduleReducer, _ref) {
  var sharedReducers = _ref.sharedReducers;

  // TODO create new API ?
  var initialContext = ctx.computeInitialContextForBrowser().state;
  var keys = Object.keys(initialContext);
  var initialContextReducers = Object.create(null);
  keys.forEach(function (key) {
    return initialContextReducers[key] = identityReducer;
  });

  var rootReducer = combineReducers(Object.assign({}, initialContextReducers, ctx.app.alpReducers, sharedReducers, {
    module: moduleReducer
  }));

  return createStore(rootReducer, initialContext);
});
//# sourceMappingURL=createServerStore.js.map