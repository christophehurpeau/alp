'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _middlewareBrowser = require('./middleware-browser');

exports.default = function createBrowserStore(app, moduleReducer, { middlewares, sharedReducers }) {
  const rootReducer = (0, _redux.combineReducers)(Object.assign({}, app.alpReducers, sharedReducers, {
    module: moduleReducer
  }));

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;

  middlewares = [(0, _middlewareBrowser.createFunctionMiddleware)(app), _middlewareBrowser.promiseMiddleware, ...middlewares];

  return (0, _redux.createStore)(rootReducer, window.__INITIAL_DATA__, composeEnhancers((0, _redux.applyMiddleware)(...middlewares)));
};
//# sourceMappingURL=createBrowserStore.js.map