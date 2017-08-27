'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReducerDictionaryType = _flowRuntime2.default.tdz(() => _types.ReducerDictionaryType);

const MODULE_INIT_TYPE = '@@alp-redux/INIT_MODULE';

// https://github.com/insin/react-examples/tree/master/code-splitting-redux-reducers
// https://medium.com/@luigiplr/react-redux-react-router-4-code-splitting-w-rxjs-webpack-32eabedf0e9
// https://gist.github.com/gaearon/0a2213881b5d53973514
// https://github.com/zeit/next.js/pull/1459

const createModuleReducer = reducers => {
  let _reducersType = _flowRuntime2.default.nullable(_flowRuntime2.default.ref(ReducerDictionaryType));

  _flowRuntime2.default.param('reducers', _reducersType).assert(reducers);

  return reducers ? (0, _redux.combineReducers)(reducers) : (state = null) => state;
};

exports.default = function createBrowserModuleStoreReducer(initialReducers) {
  let _initialReducersType = _flowRuntime2.default.nullable(_flowRuntime2.default.ref(ReducerDictionaryType));

  _flowRuntime2.default.param('initialReducers', _initialReducersType).assert(initialReducers);

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
};
//# sourceMappingURL=createBrowserModuleStoreReducer.js.map