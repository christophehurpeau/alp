'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlpBody = exports.AlpHead = exports.AlpLayout = exports.AlpHtml = exports.classNames = exports.createLoader = exports.createReducer = exports.createAction = exports.createPureStatelessComponent = exports.connect = exports.combineReducers = exports.Helmet = exports.AlpReduxApp = exports.AlpReactApp = undefined;

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
Object.defineProperty(exports, 'classNames', {
  enumerable: true,
  get: function () {
    return _utils.classNames;
  }
});

var _layout = require('./layout');

Object.defineProperty(exports, 'AlpHtml', {
  enumerable: true,
  get: function () {
    return _layout.AlpHtml;
  }
});
Object.defineProperty(exports, 'AlpLayout', {
  enumerable: true,
  get: function () {
    return _layout.AlpLayout;
  }
});
Object.defineProperty(exports, 'AlpHead', {
  enumerable: true,
  get: function () {
    return _layout.AlpHead;
  }
});
Object.defineProperty(exports, 'AlpBody', {
  enumerable: true,
  get: function () {
    return _layout.AlpBody;
  }
});
exports.default = alpReactRedux;
exports.emitAction = emitAction;

var _fody2 = _interopRequireDefault(_fody);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _modernBrowsers = require('modern-browsers');

var _modernBrowsers2 = _interopRequireDefault(_modernBrowsers);

var _AlpLayout = require('./layout/AlpLayout');

var _AlpLayout2 = _interopRequireDefault(_AlpLayout);

var _AlpReactApp = require('./AlpReactApp');

var _AlpReactApp2 = _interopRequireDefault(_AlpReactApp);

var _AlpReduxApp = require('./AlpReduxApp');

var _AlpReduxApp2 = _interopRequireDefault(_AlpReduxApp);

var _reducers = require('./reducers');

var alpReducers = _interopRequireWildcard(_reducers);

var _types = require('./types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

var _reactPureStatelessComponent = require('react-pure-stateless-component');

var _reactPureStatelessComponent2 = _interopRequireDefault(_reactPureStatelessComponent);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const ModuleDescriptorType = _flowRuntime2.default.tdz(() => _types.ModuleDescriptorType);

exports.AlpReactApp = _AlpReactApp2.default;
exports.AlpReduxApp = _AlpReduxApp2.default;
exports.createPureStatelessComponent = _reactPureStatelessComponent2.default;


const logger = new _nightingaleLogger2.default('alp:react-redux');

const OptionsType = _flowRuntime2.default.type('OptionsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('Layout', _flowRuntime2.default.nullable(_flowRuntime2.default.any())), _flowRuntime2.default.property('sharedReducers', _flowRuntime2.default.nullable(_flowRuntime2.default.object()))));

function alpReactRedux({ Layout = _AlpLayout2.default, sharedReducers = {} } = {}) {
  if (arguments[0] !== undefined) {
    _flowRuntime2.default.param('arguments[0]', OptionsType).assert(arguments[0]);
  }

  return app => {
    let _appType = _flowRuntime2.default.object();

    _flowRuntime2.default.param('app', _appType).assert(app);

    app.context.render = function (moduleDescriptor, data, _loaded) {
      let _moduleDescriptorType = _flowRuntime2.default.ref(ModuleDescriptorType);

      let _dataType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

      _flowRuntime2.default.param('moduleDescriptor', _moduleDescriptorType).assert(moduleDescriptor);

      _flowRuntime2.default.param('data', _dataType).assert(data);

      logger.debug('render view', { data });

      if (!_loaded && moduleDescriptor.loader) {
        // const _state = data;
        return moduleDescriptor.loader(Object.create(null), data).then(data => this.render(moduleDescriptor, data, true));
      }

      const moduleHasReducers = !!(moduleDescriptor.reducer || moduleDescriptor.reducers);
      const reducer = moduleDescriptor.reducer ? moduleDescriptor.reducer : (0, _redux.combineReducers)(Object.assign({}, moduleDescriptor.reducers, alpReducers, sharedReducers));

      if (reducer) {
        this.store = (0, _redux.createStore)(reducer, Object.assign({ context: this }, data));
      }

      const version = _flowRuntime2.default.string().assert(this.config.get('version'));
      const moduleIdentifier = _flowRuntime2.default.nullable(_flowRuntime2.default.string()).assert(moduleDescriptor && moduleDescriptor.identifier);

      // eslint-disable-next-line no-unused-vars
      const _ref = moduleHasReducers ? this.store.getState() : {},
            { context: unusedContext } = _ref,
            initialData = _objectWithoutProperties(_ref, ['context']);

      // TODO create alp-useragent with getter in context
      const ua = this.req.headers['user-agent'];
      const name = (0, _modernBrowsers2.default)(ua) ? 'modern-browsers' : 'es5';
      this.body = (0, _fody2.default)({
        Layout,
        layoutProps: {
          version,
          moduleIdentifier,
          scriptName: name,
          styleName: name,
          initialBrowserContext: this.computeInitialContextForBrowser(),
          initialData: moduleHasReducers ? initialData : null
        },

        App: reducer ? _AlpReduxApp2.default : _AlpReactApp2.default,
        appProps: {
          store: this.store,
          context: this
        },

        View: moduleDescriptor.View,
        props: moduleHasReducers ? undefined : data
      });
    };
  };
}

const loggerWebsocket = logger.child('websocket');

function emitAction(to, action) {
  loggerWebsocket.debug('emitAction', action);
  to.emit('redux:action', action);
}
//# sourceMappingURL=index.js.map