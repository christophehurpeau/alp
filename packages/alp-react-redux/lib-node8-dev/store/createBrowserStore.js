'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _middlewareBrowser = require('./middleware-browser');

var _identityReducer = require('../utils/identityReducer');

var _identityReducer2 = _interopRequireDefault(_identityReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function createBrowserStore(app, ctx, moduleReducer, { middlewares, sharedReducers }) {
  const reducers = Object.assign({}, app.reduxReducers, sharedReducers, {
    ctx: _identityReducer2.default,
    module: moduleReducer
  });

  Object.keys(reducers).forEach(key => {
    if (typeof reducers[key] !== 'function') throw new Error(`Invalid reducer ${key}`);
  });


  const rootReducer = (0, _redux.combineReducers)(reducers);

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;

  middlewares = [(0, _middlewareBrowser.createFunctionMiddleware)(app), _middlewareBrowser.promiseMiddleware, ...app.reduxMiddlewares, ...middlewares];

  return (0, _redux.createStore)(rootReducer, Object.assign({ ctx }, window.__INITIAL_DATA__), composeEnhancers((0, _redux.applyMiddleware)(...middlewares)));
};
//# sourceMappingURL=createBrowserStore.js.map