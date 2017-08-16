'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]); } return target; };

var _redux = require('redux');

var _middlewareBrowser = require('./middleware-browser');

var _identityReducer = require('../utils/identityReducer');

var _identityReducer2 = _interopRequireDefault(_identityReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (app, ctx, moduleReducer, { middlewares, sharedReducers }) => {
  const rootReducer = (0, _redux.combineReducers)(_extends({}, app.alpReducers, sharedReducers, {
    ctx: _identityReducer2.default,
    module: moduleReducer
  }));

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;

  return middlewares = [(0, _middlewareBrowser.createFunctionMiddleware)(app), _middlewareBrowser.promiseMiddleware, ...middlewares], (0, _redux.createStore)(rootReducer, _extends({ ctx }, window.__INITIAL_DATA__), composeEnhancers((0, _redux.applyMiddleware)(...middlewares)));
};
//# sourceMappingURL=createBrowserStore.js.map