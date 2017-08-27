'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _identityReducer = require('../utils/identityReducer');

var _identityReducer2 = _interopRequireDefault(_identityReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (ctx, moduleReducers, { sharedReducers }) => {
  const initialContext = Object.assign({
    ctx
  }, ctx.reduxInitialContext, {
    ctx: ctx
  });

  const rootReducer = (0, _redux.combineReducers)(Object.assign({}, ctx.app.reduxReducers, sharedReducers, {
    ctx: _identityReducer2.default,
    module: moduleReducers ? (0, _redux.combineReducers)(moduleReducers) : _identityReducer2.default
  }));

  return (0, _redux.createStore)(rootReducer, initialContext);
};
//# sourceMappingURL=createServerStore.js.map