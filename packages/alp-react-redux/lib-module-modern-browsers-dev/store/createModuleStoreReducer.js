import { combineReducers } from 'redux';

// const REDUX_INIT_TYPE = '@@redux/INIT';

export default (function createModuleStoreReducer() {
  let _reducers = function _reducers(state = {}) {
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