import { combineReducers } from 'redux';

var MODULE_INIT_TYPE = '@@alp-redux/INIT_MODULE';

// https://github.com/insin/react-examples/tree/master/code-splitting-redux-reducers
// https://medium.com/@luigiplr/react-redux-react-router-4-code-splitting-w-rxjs-webpack-32eabedf0e9
// https://gist.github.com/gaearon/0a2213881b5d53973514
// https://github.com/zeit/next.js/pull/1459

export default (function (initialReducers) {
  var _reducers = initialReducers;
  var combinedReducers = initialReducers ? combineReducers(initialReducers) : function (state) {
    return state;
  };
  return {
    reducer: function reducer(state, action) {
      return combinedReducers(action.type === MODULE_INIT_TYPE ? void 0 : state, action);
    },

    set: function set(store, reducers) {
      return reducers !== _reducers && new Promise(function (resolve) {
        setImmediate(function () {
          _reducers = reducers, combinedReducers = combineReducers(reducers), store.dispatch({ type: MODULE_INIT_TYPE }), resolve();
        });
      });
    }
  };
});
//# sourceMappingURL=createBrowserModuleStoreReducer.js.map