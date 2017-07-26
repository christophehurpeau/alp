'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _identityReducer = require('../utils/identityReducer');

var _identityReducer2 = _interopRequireDefault(_identityReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function createServerStore(ctx, moduleReducer, { sharedReducers }) {
  // TODO create new API ?
  const initialContext = ctx.computeInitialContextForBrowser().state;
  const keys = Object.keys(initialContext);
  const initialContextReducers = Object.create(null);
  keys.forEach(key => initialContextReducers[key] = _identityReducer2.default);

  const rootReducer = (0, _redux.combineReducers)(Object.assign({}, initialContextReducers, ctx.app.alpReducers, sharedReducers, {
    module: moduleReducer
  }));

  return (0, _redux.createStore)(rootReducer, initialContext);
};
//# sourceMappingURL=createServerStore.js.map