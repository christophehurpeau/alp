'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

const MODULE_INIT_TYPE = '@@alp-redux/INIT_MODULE';

// https://github.com/insin/react-examples/tree/master/code-splitting-redux-reducers
// https://medium.com/@luigiplr/react-redux-react-router-4-code-splitting-w-rxjs-webpack-32eabedf0e9
// https://gist.github.com/gaearon/0a2213881b5d53973514
// https://github.com/zeit/next.js/pull/1459

exports.default = initialReducers => {
  let _reducers = initialReducers;
  let combinedReducers = initialReducers ? (0, _redux.combineReducers)(initialReducers) : state => state;
  return {
    reducer: (state, action) => combinedReducers(action.type === MODULE_INIT_TYPE ? void 0 : state, action),

    set: (store, reducers) => reducers !== _reducers && new Promise(resolve => {
      setImmediate(() => {
        _reducers = reducers, combinedReducers = (0, _redux.combineReducers)(reducers), store.dispatch({ type: MODULE_INIT_TYPE }), resolve();
      });
    })
  };
};
//# sourceMappingURL=createBrowserModuleStoreReducer.js.map