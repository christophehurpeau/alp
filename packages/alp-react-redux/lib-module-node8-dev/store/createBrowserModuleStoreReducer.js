import { combineReducers } from 'redux';
import { ReducerDictionaryType as _ReducerDictionaryType } from '../types';

import t from 'flow-runtime';
const ReducerDictionaryType = t.tdz(() => _ReducerDictionaryType);
const MODULE_INIT_TYPE = '@@alp-redux/INIT_MODULE';

// https://github.com/insin/react-examples/tree/master/code-splitting-redux-reducers
// https://medium.com/@luigiplr/react-redux-react-router-4-code-splitting-w-rxjs-webpack-32eabedf0e9
// https://gist.github.com/gaearon/0a2213881b5d53973514
// https://github.com/zeit/next.js/pull/1459

const createModuleReducer = reducers => {
  let _reducersType = t.nullable(t.ref(ReducerDictionaryType));

  t.param('reducers', _reducersType).assert(reducers);
  return reducers ? combineReducers(reducers) : (state = null) => state;
};

export default (function createBrowserModuleStoreReducer(initialReducers) {
  let _initialReducersType = t.nullable(t.ref(ReducerDictionaryType));

  t.param('initialReducers', _initialReducersType).assert(initialReducers);

  let _reducers = initialReducers;
  let moduleReducer = createModuleReducer(initialReducers);
  return {
    reducer: (state, action) => moduleReducer(action.type === MODULE_INIT_TYPE ? undefined : state, action),

    set: (store, reducers) => {
      if (reducers === _reducers) return false;
      return new Promise(resolve => {
        setImmediate(() => {
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