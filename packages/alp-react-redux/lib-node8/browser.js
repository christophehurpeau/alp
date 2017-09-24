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

var _contentLoaded = require('content-loaded');

var _contentLoaded2 = _interopRequireDefault(_contentLoaded);

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

exports.Helmet = _reactHelmet2.default; // eslint-disable-next-line

exports.AlpModule = _AlpModule3.default;
exports.AlpReduxModule = _AlpReduxModuleBrowser2.default;
exports.Body = _Body3.default;
exports.AppContainer = _AppContainer3.default;


const logger = new _nightingaleLogger2.default('alp:react-redux');

const renderApp = App => (0, _reactDom.render)(_react2.default.createElement(App), document.getElementById('react-app'));

const preRender = async (ctx, appElement) => {
  const moduleVisitor = (0, _createModuleVisitor2.default)();

  const PreRenderWrappedApp = (0, _createAlpAppWrapper2.default)(appElement, {
    context: ctx,
    store: { getState: () => ({ ctx }) }
  });
  await (0, _reactTreeWalker2.default)(_react2.default.createElement(PreRenderWrappedApp), moduleVisitor.visitor);

  return moduleVisitor.getReducers();
};

exports.default = app => {
  app.reduxReducers = {
    loading: (state = 0, action) => {
      if (action.meta && action.meta.loading !== undefined) {
        return state + (action.meta.loading ? 1 : -1);
      }
      return state;
    }
  };
  app.reduxMiddlewares = [];

  return {
    renderApp: async (App, { middlewares = [], sharedReducers } = {}) => {
      let store;
      let moduleStoreReducer;

      const createStore = (ctx, moduleReducers) => {
        moduleStoreReducer = (0, _createBrowserModuleStoreReducer2.default)(moduleReducers);
        const store = (0, _createBrowserStore2.default)(app, ctx, moduleStoreReducer.reducer, {
          middlewares,
          sharedReducers
        });
        app.store = store;
        window.store = store;
        return store;
      };

      const ctx = app.createContext();

      const render = async App => {
        let appElement = _react2.default.createElement(App);


        const moduleReducers = await preRender(ctx, appElement);

        // in DEV
        // eslint-disable-next-line no-lonely-if
        if (!store) {
          store = createStore(ctx, moduleReducers);
        } else {
          moduleStoreReducer.setReducers(moduleReducers);
        }


        const WrappedApp = (0, _createAlpAppWrapper2.default)(appElement, {
          context: ctx,
          store,
          setModuleReducers: reducers => moduleStoreReducer.set(store, reducers)
        });

        await (0, _contentLoaded2.default)();
        renderApp(WrappedApp);
        logger.success('rendered');
      };

      await render(App);

      return render;
    }
  };
};
//# sourceMappingURL=browser.js.map