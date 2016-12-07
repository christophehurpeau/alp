'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEmitPromiseAction = exports.createEmitAction = exports.createLoader = exports.createReducer = exports.createAction = exports.createPureStatelessComponent = exports.connect = exports.combineReducers = exports.Helmet = exports.AlpReduxApp = exports.AlpReactApp = undefined;

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

var _fody2 = _interopRequireDefault(_fody);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _middlewaresBrowser = require('./middlewares-browser');

var _loadingBar2 = require('./loading-bar');

var _loadingBar3 = _interopRequireDefault(_loadingBar2);

var _AlpReactApp = require('./AlpReactApp');

var _AlpReactApp2 = _interopRequireDefault(_AlpReactApp);

var _AlpReduxApp = require('./AlpReduxApp');

var _AlpReduxApp2 = _interopRequireDefault(_AlpReduxApp);

var _reactPureStatelessComponent = require('react-pure-stateless-component');

var _reactPureStatelessComponent2 = _interopRequireDefault(_reactPureStatelessComponent);

var _createAction2 = require('./utils/createAction');

var _createAction3 = _interopRequireDefault(_createAction2);

var _createReducer2 = require('./utils/createReducer');

var _createReducer3 = _interopRequireDefault(_createReducer2);

var _createLoader2 = require('./utils/createLoader');

var _createLoader3 = _interopRequireDefault(_createLoader2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global window */
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

function alpReactRedux(element) {
  return app => {
    const middlewares = [(0, _middlewaresBrowser.createFunctionMiddleware)(app), _middlewaresBrowser.promiseMiddleware];

    if (app.websocket) {
      const loggerWebsocket = logger.child('websocket');
      loggerWebsocket.debug('register websocket redux:action');
      app.websocket.on('redux:action', action => {
        loggerWebsocket.debug('dispatch action from websocket', action);
        if (store) {
          store.dispatch(action);
        }
      });
      middlewares.push((0, _websocket.websocketMiddleware)(app));
    }

    app.context.render = function (moduleDescriptor, data, _loaded, _loadingBar) {
      if (!_loadingBar) _loadingBar = (0, _loadingBar3.default)();
      logger.debug('render view', { data });

      try {
        if (!moduleDescriptor.View) {
          throw new Error('View is undefined, class expected');
        }

        if (!_loaded && moduleDescriptor.loader) {
          const currentState = store && currentModuleDescriptorIdentifier === moduleDescriptor.identifier ? store.getState() : undefined;

          // const _state = data;
          return moduleDescriptor.loader(currentState, data).then(data => this.render(moduleDescriptor, data, true, _loadingBar));
        }

        let reducer = moduleDescriptor.reducer;

        if (!reducer) {
          if (store) {
            reducer = () => {};
            store.dispatch({ type: HYDRATE_STATE, state: Object.create(null) });
          }
        } else if (store === undefined) {
          store = (0, _redux.createStore)((state, action) => {
            if (action.type === HYDRATE_STATE) {
              state = action.state;
            }

            return reducer(state, action);
          }, data, (0, _redux.compose)((0, _redux.applyMiddleware)(...middlewares), window.devToolsExtension ? window.devToolsExtension() : f => f));
        } else {
          const state = Object.create(null);

          if (store && currentModuleDescriptorIdentifier === moduleDescriptor.identifier) {
            // keep state
            Object.assign(state, store.getState());
          }

          Object.assign(state, data);
          store.dispatch({ type: HYDRATE_STATE, state });
        }

        currentModuleDescriptorIdentifier = moduleDescriptor.identifier;
        this.store = store;

        (0, _fody2.default)({
          App: moduleDescriptor.reducer ? _AlpReduxApp2.default : _AlpReactApp2.default,
          appProps: {
            store: store,
            context: this,
            moduleDescriptor
          },
          View: moduleDescriptor.View,
          props: data,
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
//# sourceMappingURL=browser.js.map