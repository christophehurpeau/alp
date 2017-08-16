'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppContainer = exports.Body = exports.AlpReduxModule = exports.AlpModule = exports.identityReducer = exports.createPureStatelessComponent = exports.classNames = exports.createLoader = exports.createReducer = exports.createAction = exports.connect = exports.combineReducers = exports.Helmet = void 0;

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

var _reactTreeWalker = require('react-tree-walker');

var _reactTreeWalker2 = _interopRequireDefault(_reactTreeWalker);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _createAlpAppWrapper = require('./createAlpAppWrapper');

var _createAlpAppWrapper2 = _interopRequireDefault(_createAlpAppWrapper);

var _createBrowserStore = require('./store/createBrowserStore');

var _createBrowserStore2 = _interopRequireDefault(_createBrowserStore);

var _createBrowserModuleStoreReducer = require('./store/createBrowserModuleStoreReducer');

var _createBrowserModuleStoreReducer2 = _interopRequireDefault(_createBrowserModuleStoreReducer);

var _websocket = require('./websocket');

var _createModuleVisitor = require('./module/createModuleVisitor');

var _createModuleVisitor2 = _interopRequireDefault(_createModuleVisitor);

var _AlpModule2 = require('./module/AlpModule');

var _AlpModule3 = _interopRequireDefault(_AlpModule2);

var _AlpReduxModuleBrowser = require('./module/AlpReduxModuleBrowser');

var _AlpReduxModuleBrowser2 = _interopRequireDefault(_AlpReduxModuleBrowser);

var _Body2 = require('./layout/Body');

var _Body3 = _interopRequireDefault(_Body2);

var _AppContainer2 = require('./layout/AppContainer');

var _AppContainer3 = _interopRequireDefault(_AppContainer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Helmet = _reactHelmet2.default;
exports.AlpModule = _AlpModule3.default;
exports.AlpReduxModule = _AlpReduxModuleBrowser2.default;
exports.Body = _Body3.default;
exports.AppContainer = _AppContainer3.default;


const logger = new _nightingaleLogger2.default('alp:react-redux');

const renderApp = App => (0, _reactDom.render)(_react2.default.createElement(App), document.getElementById('react-app'));

exports.default = async (app, App, { sharedReducers } = {}) => {
  const ctx = app.createContext();
  let store;
  let moduleStoreReducer;

  const createStore = (ctx, moduleReducers) => {
    moduleStoreReducer = (0, _createBrowserModuleStoreReducer2.default)(moduleReducers);

    const store = (0, _createBrowserStore2.default)(app, ctx, moduleStoreReducer.reducer, {
      sharedReducers,
      middlewares: [app.websocket && (0, _websocket.websocketMiddleware)(app)].filter(Boolean)
    });

    return app.store = store, store;
  };

  const preRender = async app => {
    const moduleVisitor = (0, _createModuleVisitor2.default)();

    const PreRenderWrappedApp = (0, _createAlpAppWrapper2.default)(app, {
      context: ctx,
      store: { getState: () => ({ ctx }) }
    });


    return await (0, _reactTreeWalker2.default)(_react2.default.createElement(PreRenderWrappedApp), moduleVisitor.visitor), moduleVisitor.getReducers();
  };

  const render = async App => {
    let app = _react2.default.createElement(App);


    const moduleReducers = await preRender(app);

    store ? moduleStoreReducer.setReducers(moduleReducers) : store = createStore(ctx, moduleReducers);


    const WrappedApp = (0, _createAlpAppWrapper2.default)(app, {
      context: ctx,
      store,
      setModuleReducers: reducers => moduleStoreReducer.set(store, reducers)
    });

    renderApp(WrappedApp), logger.success('rendered');
  };

  if (app.websocket) {
    const loggerWebsocket = logger.child('websocket');
    loggerWebsocket.debug('register websocket redux:action'), app.websocket.on('redux:action', action => {
      loggerWebsocket.debug('dispatch action from websocket', action), store && store.dispatch(action);
    });
  }

  return await render(App), render;
};
//# sourceMappingURL=browser.js.map