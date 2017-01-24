'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEmitPromiseAction = exports.createEmitAction = exports.createLoader = exports.createReducer = exports.createAction = exports.createPureStatelessComponent = exports.connect = exports.combineReducers = exports.Helmet = exports.AlpReduxApp = exports.AlpReactApp = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* global window */


var _fody = require('fody');

Object.defineProperty(exports, 'Helmet', {
  enumerable: true,
  get: function () {
    return _fody.Helmet;
  }
});

var _redux = require('redux');

Object.defineProperty(exports, 'combineReducers', {
  enumerable: true,
  get: function () {
    return _redux.combineReducers;
  }
});

var _reactRedux = require('react-redux');

Object.defineProperty(exports, 'connect', {
  enumerable: true,
  get: function () {
    return _reactRedux.connect;
  }
});

var _websocket = require('./websocket');

Object.defineProperty(exports, 'createEmitAction', {
  enumerable: true,
  get: function () {
    return _websocket.createEmitAction;
  }
});
Object.defineProperty(exports, 'createEmitPromiseAction', {
  enumerable: true,
  get: function () {
    return _websocket.createEmitPromiseAction;
  }
});
exports.default = alpReactRedux;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _fody2 = _interopRequireDefault(_fody);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _middlewareBrowser = require('./middleware-browser');

var _loadingBar2 = require('./loading-bar');

var _loadingBar3 = _interopRequireDefault(_loadingBar2);

var _AlpReactApp = require('./AlpReactApp');

var _AlpReactApp2 = _interopRequireDefault(_AlpReactApp);

var _AlpReduxApp = require('./AlpReduxApp');

var _AlpReduxApp2 = _interopRequireDefault(_AlpReduxApp);

var _reducers = require('./reducers');

var alpReducers = _interopRequireWildcard(_reducers);

var _reactPureStatelessComponent = require('react-pure-stateless-component');

var _reactPureStatelessComponent2 = _interopRequireDefault(_reactPureStatelessComponent);

var _createAction2 = require('./utils/createAction');

var _createAction3 = _interopRequireDefault(_createAction2);

var _createReducer2 = require('./utils/createReducer');

var _createReducer3 = _interopRequireDefault(_createReducer2);

var _createLoader2 = require('./utils/createLoader');

var _createLoader3 = _interopRequireDefault(_createLoader2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.AlpReactApp = _AlpReactApp2.default;
exports.AlpReduxApp = _AlpReduxApp2.default;
exports.createPureStatelessComponent = _reactPureStatelessComponent2.default;
exports.createAction = _createAction3.default;
exports.createReducer = _createReducer3.default;
exports.createLoader = _createLoader3.default;


const HYDRATE_STATE = 'HYDRATE_STATE';
const logger = new _nightingaleLogger2.default('alp:react-redux');

let store;
let currentModuleDescriptorIdentifier;

const createHydratableReducer = reducer => {
  _assert(reducer, _tcombForked2.default.Function, 'reducer');

  return (state, action) => {
    // ignore redux init
    if (action.type === '@@redux/INIT') {
      return;
    }

    if (action.type === HYDRATE_STATE) {
      state = action.state;
    }

    return reducer(state, action);
  };
};

const OptionsType = _tcombForked2.default.interface({
  sharedReducers: _tcombForked2.default.maybe(_tcombForked2.default.Object)
}, {
  name: 'OptionsType',
  strict: true
});

function alpReactRedux(element, { sharedReducers = {} } = {}) {
  _assert({
    sharedReducers
  }, OptionsType, '{ sharedReducers = {} }');

  return app => {
    const middleware = [(0, _middlewareBrowser.createFunctionMiddleware)(app), _middlewareBrowser.promiseMiddleware];

    if (app.websocket) {
      const loggerWebsocket = logger.child('websocket');
      loggerWebsocket.debug('register websocket redux:action');
      app.websocket.on('redux:action', action => {
        loggerWebsocket.debug('dispatch action from websocket', action);
        if (store) {
          store.dispatch(action);
        }
      });
      middleware.push((0, _websocket.websocketMiddleware)(app));
    }

    app.context.render = function (moduleDescriptor, data, _loaded, _loadingBar) {
      if (!_loadingBar) _loadingBar = (0, _loadingBar3.default)();
      logger.debug('render view', { data });

      try {
        if (!moduleDescriptor.View) {
          throw new Error('View is undefined, class expected');
        }

        if (!_loaded && moduleDescriptor.loader) {
          const currentState = store && currentModuleDescriptorIdentifier === moduleDescriptor.identifier ? store.getState() : Object.create(null);

          // const _state = data;
          return moduleDescriptor.loader(currentState, data).then(data => this.render(moduleDescriptor, data, true, _loadingBar));
        }

        const moduleHasReducers = !!(moduleDescriptor.reducer || moduleDescriptor.reducers);
        let reducer = moduleDescriptor.reducer ? moduleDescriptor.reducer : (0, _redux.combineReducers)(_extends({}, moduleDescriptor.reducers, alpReducers, sharedReducers));

        if (!reducer) {
          if (store) {
            reducer = () => {};
            store.dispatch({ type: HYDRATE_STATE, state: Object.create(null) });
          }
        } else if (store === undefined) {
          const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;
          store = (0, _redux.createStore)(createHydratableReducer(reducer), Object.assign(Object.create(null), { context: this }, data), composeEnhancers((0, _redux.applyMiddleware)(...middleware)));
        } else {
          const state = Object.create(null);
          const isSameModule = currentModuleDescriptorIdentifier === moduleDescriptor.identifier;

          if (store) {
            if (isSameModule) {
              // keep state
              Object.assign(state, store.getState());
            } else {
              // destroy current component
              (0, _fody.unmountComponentAtNode)(element);
              // replace reducer
              store.replaceReducer(createHydratableReducer(reducer));
              // add initial context
              state.context = this;
            }
          }

          if (moduleHasReducers) Object.assign(state, data);
          store.dispatch({ type: HYDRATE_STATE, state });
        }

        currentModuleDescriptorIdentifier = moduleDescriptor.identifier;

        if (reducer) {
          this.store = store;
        }

        (0, _fody2.default)({
          App: reducer ? _AlpReduxApp2.default : _AlpReactApp2.default,
          appProps: {
            store,
            context: this,
            moduleDescriptor
          },
          View: moduleDescriptor.View,
          props: moduleHasReducers ? undefined : data,
          element
        });
      } catch (err) {
        _loadingBar();
        throw err;
      }

      _loadingBar();
    };
  };
}

function _assert(x, type, name) {
  if (false) {
    _tcombForked2.default.fail = function (message) {
      console.warn(message);
    };
  }

  if (_tcombForked2.default.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail('Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=browser.js.map