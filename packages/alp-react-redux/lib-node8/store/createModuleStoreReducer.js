'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

// const REDUX_INIT_TYPE = '@@redux/INIT';

exports.default = () => {
  let _reducers = (state = {}) => state;
  return {
    reducer: state => _reducers(state),
    set: (store, reducers) => {
      _reducers = (0, _redux.combineReducers)(reducers);
      // store.dispatch({ })
    }
  };
};
//# sourceMappingURL=createModuleStoreReducer.js.map