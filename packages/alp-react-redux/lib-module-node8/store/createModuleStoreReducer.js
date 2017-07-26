import { combineReducers } from 'redux';

// const REDUX_INIT_TYPE = '@@redux/INIT';

export default (() => {
  let _reducers = (state = {}) => state;
  return {
    reducer: state => _reducers(state),
    set: (store, reducers) => {
      _reducers = combineReducers(reducers);
      // store.dispatch({ })
    }
  };
});
//# sourceMappingURL=createModuleStoreReducer.js.map