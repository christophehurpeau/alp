'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppContainer = exports.Body = exports.AlpReduxModule = exports.AlpModule = exports.identityReducer = exports.createPureStatelessComponent = exports.classNames = exports.createLoader = exports.createReducer = exports.createAction = exports.connect = exports.combineReducers = exports.Helmet = undefined;

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

var _index = require('./utils/index');

Object.defineProperty(exports, 'createAction', {
  enumerable: true,
  get: function () {
    return _index.createAction;
  }
});
Object.defineProperty(exports, 'createReducer', {
  enumerable: true,
  get: function () {
    return _index.createReducer;
  }
});
Object.defineProperty(exports, 'createLoader', {
  enumerable: true,
  get: function () {
    return _index.createLoader;
  }
});
Object.defineProperty(exports, 'classNames', {
  enumerable: true,
  get: function () {
    return _index.classNames;
  }
});
Object.defineProperty(exports, 'createPureStatelessComponent', {
  enumerable: true,
  get: function () {
    return _index.createPureStatelessComponent;
  }
});
Object.defineProperty(exports, 'identityReducer', {
  enumerable: true,
  get: function () {
    return _index.identityReducer;
  }
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactHelmet = require('react-helmet');

var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _createAlpAppWrapper = require('./createAlpAppWrapper');

var _createAlpAppWrapper2 = _interopRequireDefault(_createAlpAppWrapper);

var _createBrowserStore = require('./store/createBrowserStore');

var _createBrowserStore2 = _interopRequireDefault(_createBrowserStore);

var _createModuleStoreReducer = require('./store/createModuleStoreReducer');

var _createModuleStoreReducer2 = _interopRequireDefault(_createModuleStoreReducer);

var _websocket = require('./websocket');

var _AlpModule2 = require('./module/AlpModule');

var _AlpModule3 = _interopRequireDefault(_AlpModule2);

var _AlpReduxModuleServer = require('./module/AlpReduxModuleServer');

var _AlpReduxModuleServer2 = _interopRequireDefault(_AlpReduxModuleServer);

var _Body2 = require('./layout/Body');

var _Body3 = _interopRequireDefault(_Body2);

var _AppContainer2 = require('./layout/AppContainer');

var _AppContainer3 = _interopRequireDefault(_AppContainer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Helmet = _reactHelmet2.default;
exports.AlpModule = _AlpModule3.default;
exports.AlpReduxModule = _AlpReduxModuleServer2.default;
exports.Body = _Body3.default;
exports.AppContainer = _AppContainer3.default;


const logger = new _nightingaleLogger2.default('alp:react-redux');

const renderApp = App => (0, _reactDom.render)(_react2.default.createElement(App), document.getElementById('react-app'));

exports.default = (app, { sharedReducers } = {}) => {
  const moduleStoreReducer = (0, _createModuleStoreReducer2.default)();
  const store = (0, _createBrowserStore2.default)(app, moduleStoreReducer.reducer, {
    sharedReducers,
    middlewares: [app.websocket && (0, _websocket.websocketMiddleware)(app)].filter(Boolean)
  });

  app.store = store;

  if (app.websocket) {
    const loggerWebsocket = logger.child('websocket');
    loggerWebsocket.debug('register websocket redux:action');
    app.websocket.on('redux:action', action => {
      loggerWebsocket.debug('dispatch action from websocket', action);
      if (store) {
        store.dispatch(action);
      }
    });
  }

  const ctx = app.createContext();
  ctx.urlGenerator = () => null;

  return App => {
    const WrappedApp = (0, _createAlpAppWrapper2.default)(App, {
      context: ctx,
      app,
      store,
      setModuleReducers: reducers => moduleStoreReducer.set(store, reducers)
    });

    renderApp(WrappedApp);
    logger.success('rendered');
  };
};
//# sourceMappingURL=browser.js.map