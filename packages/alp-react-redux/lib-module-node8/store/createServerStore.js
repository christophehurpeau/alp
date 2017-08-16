var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]); } return target; };

import { combineReducers, createStore } from 'redux';
import identityReducer from '../utils/identityReducer';

export default ((ctx, moduleReducers, { sharedReducers }) => {
  // TODO create new API ?
  const initialContext = ctx.computeInitialContextForBrowser().state;
  const keys = Object.keys(initialContext);
  const initialContextReducers = Object.create(null);
  keys.forEach(key => initialContextReducers[key] = identityReducer), initialContext.ctx = ctx;


  const rootReducer = combineReducers(_extends({}, initialContextReducers, ctx.app.alpReducers, sharedReducers, {
    ctx: identityReducer,
    module: moduleReducers ? combineReducers(moduleReducers) : identityReducer
  }));

  return createStore(rootReducer, initialContext);
});
//# sourceMappingURL=createServerStore.js.map