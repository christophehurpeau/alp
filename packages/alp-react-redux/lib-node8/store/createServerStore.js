'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redux = require('redux');

var _identityReducer = require('../utils/identityReducer');

var _identityReducer2 = _interopRequireDefault(_identityReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (ctx, moduleReducers, { sharedReducers }) => {
  // TODO create new API ?
  const initialContext = ctx.computeInitialContextForBrowser().state;
  const keys = Object.keys(initialContext);
  const initialContextReducers = Object.create(null);
  keys.forEach(key => initialContextReducers[key] = _identityReducer2.default);

  initialContext.ctx = ctx;

  const rootReducer = (0, _redux.combineReducers)(_extends({}, initialContextReducers, ctx.app.alpReducers, sharedReducers, {
    ctx: _identityReducer2.default,
    module: moduleReducers ? (0, _redux.combineReducers)(moduleReducers) : _identityReducer2.default
  }));

  return (0, _redux.createStore)(rootReducer, initialContext);
};
//# sourceMappingURL=createServerStore.js.map