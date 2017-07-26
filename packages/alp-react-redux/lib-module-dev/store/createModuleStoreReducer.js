import { combineReducers } from 'redux';

// const REDUX_INIT_TYPE = '@@redux/INIT';

export default (function createModuleStoreReducer() {
  var _reducers = function _reducers() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return state;
  };
  return {
    reducer: function reducer(state) {
      return _reducers(state);
    },
    set: function set(store, reducers) {
      _reducers = combineReducers(reducers);
      // store.dispatch({ })
    }
  };
});
//# sourceMappingURL=createModuleStoreReducer.js.map