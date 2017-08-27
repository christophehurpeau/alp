import { combineReducers } from 'redux';


var MODULE_INIT_TYPE = '@@alp-redux/INIT_MODULE';

// https://github.com/insin/react-examples/tree/master/code-splitting-redux-reducers
// https://medium.com/@luigiplr/react-redux-react-router-4-code-splitting-w-rxjs-webpack-32eabedf0e9
// https://gist.github.com/gaearon/0a2213881b5d53973514
// https://github.com/zeit/next.js/pull/1459

var createModuleReducer = function createModuleReducer(reducers) {
  return reducers ? combineReducers(reducers) : function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    return state;
  };
};

export default (function (initialReducers) {
  var _reducers = initialReducers;
  var moduleReducer = createModuleReducer(initialReducers);
  return {
    reducer: function reducer(state, action) {
      return moduleReducer(action.type === MODULE_INIT_TYPE ? undefined : state, action);
    },

    set: function set(store, reducers) {
      if (reducers === _reducers) return false;
      return new Promise(function (resolve) {
        setImmediate(function () {
          _reducers = reducers;
          moduleReducer = createModuleReducer(reducers);
          store.dispatch({ type: MODULE_INIT_TYPE });
          resolve();
        });
      });
    }
  };
});
//# sourceMappingURL=createBrowserModuleStoreReducer.js.map