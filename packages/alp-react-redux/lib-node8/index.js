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
exports.emitAction = emitAction;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _reactHelmet = require('react-helmet');

var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _modernBrowsers = require('modern-browsers');

var _modernBrowsers2 = _interopRequireDefault(_modernBrowsers);

var _htmlLayout = require('./layout/htmlLayout');

var _htmlLayout2 = _interopRequireDefault(_htmlLayout);

var _createAlpAppWrapper = require('./createAlpAppWrapper');

var _createAlpAppWrapper2 = _interopRequireDefault(_createAlpAppWrapper);

var _createServerStore = require('./store/createServerStore');

var _createServerStore2 = _interopRequireDefault(_createServerStore);

var _createModuleStoreReducer = require('./store/createModuleStoreReducer');

var _createModuleStoreReducer2 = _interopRequireDefault(_createModuleStoreReducer);

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

const renderHtml = (App, options) => {
  const content = (0, _server.renderToString)(_react2.default.createElement(App));
  const helmet = _reactHelmet2.default.renderStatic();
  return (0, _htmlLayout2.default)(helmet, content, options);
};

exports.default = (App, options = {}) => ctx => {
  const version = ctx.config.get('version');
  // TODO create alp-useragent with getter in context
  const ua = ctx.req.headers['user-agent'];
  const name = (0, _modernBrowsers2.default)(ua) ? 'modern-browsers' : 'es5';
  ctx.urlGenerator = () => null;

  const moduleStoreReducer = (0, _createModuleStoreReducer2.default)();
  const store = (0, _createServerStore2.default)(ctx, moduleStoreReducer.reducer, {
    sharedReducers: options.sharedReducers
  });

  const WrappedApp = (0, _createAlpAppWrapper2.default)(App, {
    context: ctx,
    app: ctx.app,
    store,
    setModuleReducers: reducers => moduleStoreReducer.set(store, reducers)
  });

  ctx.body = renderHtml(WrappedApp, {
    version,
    scriptName: options.scriptName !== undefined ? options.scriptName : name,
    styleName: options.styleName !== undefined ? options.styleName : name,
    polyfillFeatures: options.polyfillFeatures,
    initialData: store.getState()
  });
};

const loggerWebsocket = logger.child('websocket');

function emitAction(to, action) {
  loggerWebsocket.debug('emitAction', action);
  to.emit('redux:action', action);
}
//# sourceMappingURL=index.js.map