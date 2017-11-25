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

var _reactTreeWalker = require('react-tree-walker');

var _reactTreeWalker2 = _interopRequireDefault(_reactTreeWalker);

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

var _createModuleVisitor = require('./module/createModuleVisitor');

var _createModuleVisitor2 = _interopRequireDefault(_createModuleVisitor);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

var _AlpModule2 = require('./module/AlpModule');

var _AlpModule3 = _interopRequireDefault(_AlpModule2);

var _AlpReduxModuleServer = require('./module/AlpReduxModuleServer');

var _AlpReduxModuleServer2 = _interopRequireDefault(_AlpReduxModuleServer);

var _Body2 = require('./layout/Body');

var _Body3 = _interopRequireDefault(_Body2);

var _AppContainer2 = require('./layout/AppContainer');

var _AppContainer3 = _interopRequireDefault(_AppContainer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.Helmet = _reactHelmet2.default;
exports.AlpModule = _AlpModule3.default;
exports.AlpReduxModule = _AlpReduxModuleServer2.default;
exports.Body = _Body3.default;
exports.AppContainer = _AppContainer3.default;


const logger = new _nightingaleLogger2.default('alp:react-redux');

const renderHtml = (app, options) => {
  const content = (0, _server.renderToString)(app);
  const helmet = _reactHelmet2.default.renderStatic();
  return (0, _htmlLayout2.default)(helmet, content, options);
};

const isModernBrowser = (0, _modernBrowsers2.default)();

const OptionsType = _flowRuntime2.default.type('OptionsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('sharedReducers', _flowRuntime2.default.nullable(_flowRuntime2.default.object(_flowRuntime2.default.indexer('key', _flowRuntime2.default.string(), _flowRuntime2.default.any())))), _flowRuntime2.default.property('scriptName', _flowRuntime2.default.union(_flowRuntime2.default.nullable(_flowRuntime2.default.string()), _flowRuntime2.default.boolean(false))), _flowRuntime2.default.property('styleName', _flowRuntime2.default.union(_flowRuntime2.default.nullable(_flowRuntime2.default.string()), _flowRuntime2.default.boolean(false))), _flowRuntime2.default.property('polyfillFeatures', _flowRuntime2.default.nullable(_flowRuntime2.default.string()), true)));

exports.default = function index() {
  return app => {
    app.reduxReducers = {};
    app.reduxMiddlewares = [];

    return {
      middleware: (ctx, next) => {
        ctx.reduxInitialContext = {};
        return next();
      },

      createApp: (App, options = {}) => {
        let _optionsType = _flowRuntime2.default.nullable(OptionsType);

        _flowRuntime2.default.param('options', _optionsType).assert(options);

        return async ctx => {
          const version = _flowRuntime2.default.string().assert(ctx.config.get('version'));
          // TODO create alp-useragent with getter in context
          const ua = ctx.req.headers['user-agent'];
          const name = isModernBrowser(ua) ? 'modern-browsers' : 'es5';

          const app = _react2.default.createElement(App);
          const moduleVisitor = (0, _createModuleVisitor2.default)();

          const PreRenderWrappedApp = (0, _createAlpAppWrapper2.default)(app, { context: ctx, store: { getState: () => ({ ctx }) } });
          await (0, _reactTreeWalker2.default)(_react2.default.createElement(PreRenderWrappedApp), moduleVisitor.visitor);

          const store = (0, _createServerStore2.default)(ctx, moduleVisitor.getReducers(), {
            sharedReducers: options.sharedReducers
          });

          const WrappedApp = (0, _createAlpAppWrapper2.default)(app, { context: ctx, store });

          // eslint-disable-next-line no-unused-vars
          const _store$getState = store.getState(),
                { ctx: removeCtxFromInitialData } = _store$getState,
                initialData = _objectWithoutProperties(_store$getState, ['ctx']);
          ctx.body = await renderHtml(_react2.default.createElement(WrappedApp), {
            version,
            scriptName: options.scriptName !== undefined ? options.scriptName : name,
            styleName: options.styleName !== undefined ? options.styleName : name,
            polyfillFeatures: options.polyfillFeatures,
            initialData
          });
        };
      }
    };
  };
};

const loggerWebsocket = logger.child('websocket');

function emitAction(to, action) {
  loggerWebsocket.debug('emitAction', action);
  to.emit('redux:action', action);
}
//# sourceMappingURL=index.js.map