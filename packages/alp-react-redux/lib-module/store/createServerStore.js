var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]); } return target; };

import { combineReducers, createStore } from 'redux';
import identityReducer from '../utils/identityReducer';

export default (function (ctx, moduleReducers, _ref) {
  var sharedReducers = _ref.sharedReducers;

  // TODO create new API ?
  var initialContext = ctx.computeInitialContextForBrowser().state;
  var keys = Object.keys(initialContext);
  var initialContextReducers = Object.create(null);
  keys.forEach(function (key) {
    return initialContextReducers[key] = identityReducer;
  }), initialContext.ctx = ctx;


  var rootReducer = combineReducers(_extends({}, initialContextReducers, ctx.app.alpReducers, sharedReducers, {
    ctx: identityReducer,
    module: moduleReducers ? combineReducers(moduleReducers) : identityReducer
  }));

  return createStore(rootReducer, initialContext);
});
//# sourceMappingURL=createServerStore.js.map