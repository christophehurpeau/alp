'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEmitPromiseAction = exports.createEmitAction = exports.classNames = exports.createPureStatelessComponent = exports.createLoader = exports.createReducer = exports.createAction = exports.connect = exports.combineReducers = exports.Helmet = exports.AlpReduxApp = exports.AlpReactApp = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'browser.jsx';

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

var _utils = require('./utils');

Object.defineProperty(exports, 'createAction', {
  enumerable: true,
  get: function () {
    return _utils.createAction;
  }
});
Object.defineProperty(exports, 'createReducer', {
  enumerable: true,
  get: function () {
    return _utils.createReducer;
  }
});
Object.defineProperty(exports, 'createLoader', {
  enumerable: true,
  get: function () {
    return _utils.createLoader;
  }
});
Object.defineProperty(exports, 'createPureStatelessComponent', {
  enumerable: true,
  get: function () {
    return _utils.createPureStatelessComponent;
  }
});
Object.defineProperty(exports, 'classNames', {
  enumerable: true,
  get: function () {
    return _utils.classNames;
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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _middlewareBrowser = require('./middleware-browser');

var _loadingBar2 = require('./loading-bar');

var _loadingBar3 = _interopRequireDefault(_loadingBar2);

var _AlpReactApp = require('./layout/AlpReactApp');

var _AlpReactApp2 = _interopRequireDefault(_AlpReactApp);

var _AlpReduxApp = require('./layout/AlpReduxApp');

var _AlpReduxApp2 = _interopRequireDefault(_AlpReduxApp);

var _reducers = require('./reducers');

var alpReducers = _interopRequireWildcard(_reducers);

var _types = require('./types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

var _reactHelmet = require('react-helmet');

var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReactComponentType = _flowRuntime2.default.tdz(() => _types.ReactComponentType);

exports.AlpReactApp = _AlpReactApp2.default;
exports.AlpReduxApp = _AlpReduxApp2.default;
exports.Helmet = _reactHelmet2.default;


const HYDRATE_STATE = 'HYDRATE_STATE';
const logger = new _nightingaleLogger2.default('alp:react-redux');

let store;
let currentModuleDescriptorIdentifier;

const AppOptionsType = _flowRuntime2.default.type('AppOptionsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('element', _flowRuntime2.default.any()), _flowRuntime2.default.property('App', _flowRuntime2.default.ref(ReactComponentType)), _flowRuntime2.default.property('appProps', _flowRuntime2.default.object()), _flowRuntime2.default.property('View', _flowRuntime2.default.ref(ReactComponentType)), _flowRuntime2.default.property('props', _flowRuntime2.default.nullable(_flowRuntime2.default.object()))));

const renderApp = _arg => {
  let { App, appProps, View, props, element } = AppOptionsType.assert(_arg);

  let app = _react2.default.createElement(
    App,
    _extends({}, appProps, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 34
      }
    }),
    _react2.default.createElement(View, _extends({}, props, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 34
      }
    }))
  );
  return (0, _reactDom.render)(app, element);
};

const createHydratableReducer = reducer => {
  let _reducerType = _flowRuntime2.default.function();

  _flowRuntime2.default.param('reducer', _reducerType).assert(reducer);

  return (state, action) => {
    if (action.type === HYDRATE_STATE) {
      state = action.state;
    }

    return reducer(state, action);
  };
};

const OptionsType = _flowRuntime2.default.type('OptionsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('appHOC', _flowRuntime2.default.nullable(_flowRuntime2.default.function())), _flowRuntime2.default.property('sharedReducers', _flowRuntime2.default.nullable(_flowRuntime2.default.object()))));

const getReactAppElement = () => document.getElementById('react-app');

function alpReactRedux(_arg2 = {}) {
  let { appHOC, sharedReducers = {} } = _flowRuntime2.default.nullable(OptionsType).assert(_arg2);

  const AlpReactAppLayout = appHOC ? appHOC(_AlpReactApp2.default) : _AlpReactApp2.default;
  const AlpReduxAppLayout = appHOC ? appHOC(_AlpReduxApp2.default) : _AlpReduxApp2.default;

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
        let reducer = moduleDescriptor.reducer ? moduleDescriptor.reducer : (0, _redux.combineReducers)(Object.assign({}, moduleDescriptor.reducers, alpReducers, sharedReducers));

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
              (0, _reactDom.unmountComponentAtNode)(getReactAppElement());
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

        renderApp({
          element: getReactAppElement(),
          App: reducer ? AlpReduxAppLayout : AlpReactAppLayout,
          appProps: {
            store,
            context: this,
            moduleDescriptor
          },
          View: moduleDescriptor.View,
          props: moduleHasReducers ? undefined : data
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