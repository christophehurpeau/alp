'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlpBody = exports.AlpHead = exports.AlpLayout = exports.AlpHtml = exports.createLoader = exports.createReducer = exports.createAction = exports.createPureStatelessComponent = exports.connect = exports.combineReducers = exports.Helmet = exports.AlpReduxApp = exports.AlpReactApp = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _fody2 = _interopRequireDefault(_fody);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _AlpLayout = require('./layout/AlpLayout');

var _AlpLayout2 = _interopRequireDefault(_AlpLayout);

var _AlpReactApp = require('./AlpReactApp');

var _AlpReactApp2 = _interopRequireDefault(_AlpReactApp);

var _AlpReduxApp = require('./AlpReduxApp');

var _AlpReduxApp2 = _interopRequireDefault(_AlpReduxApp);

var _reducers = require('./reducers');

var alpReducers = _interopRequireWildcard(_reducers);

var _types = require('./types');

var _reactPureStatelessComponent = require('react-pure-stateless-component');

var _reactPureStatelessComponent2 = _interopRequireDefault(_reactPureStatelessComponent);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.AlpReactApp = _AlpReactApp2.default;
exports.AlpReduxApp = _AlpReduxApp2.default;
exports.createPureStatelessComponent = _reactPureStatelessComponent2.default;


const logger = new _nightingaleLogger2.default('alp:react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
const agents = [{ name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 14 }, { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 47 }, { name: 'Chrome', regexp: /chrom(?:e|ium)\/([\d]+)/i, modernMinVersion: 51 }, // also works for opera.
{ name: 'Safari', regexp: /version\/([\d\w.-]+).*safari/i, modernMinVersion: 10 }];

const OptionsType = _tcombForked2.default.interface({
  Layout: _tcombForked2.default.maybe(_tcombForked2.default.Any),
  sharedReducers: _tcombForked2.default.maybe(_tcombForked2.default.Object)
}, {
  name: 'OptionsType',
  strict: true
});

function alpReactRedux({ Layout = _AlpLayout2.default, sharedReducers = {} } = {}) {
  _assert({
    Layout,
    sharedReducers
  }, OptionsType, '{ Layout = AlpLayout, sharedReducers = {} }');

  return app => {
    _assert(app, _tcombForked2.default.Object, 'app');

    app.context.render = function (moduleDescriptor, data, _loaded) {
      _assert(moduleDescriptor, _types.ModuleDescriptorType, 'moduleDescriptor');

      _assert(data, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'data');

      logger.debug('render view', { data });

      if (!_loaded && moduleDescriptor.loader) {
        // const _state = data;
        return moduleDescriptor.loader(Object.create(null), data).then(data => this.render(moduleDescriptor, data, true));
      }

      const moduleHasReducers = !!(moduleDescriptor.reducer || moduleDescriptor.reducers);
      const reducer = moduleDescriptor.reducer ? moduleDescriptor.reducer : (0, _redux.combineReducers)(_extends({}, moduleDescriptor.reducers, alpReducers, sharedReducers));

      if (reducer) {
        this.store = (0, _redux.createStore)(reducer, _extends({ context: this }, data));
      }

      const version = _assert(this.config.get('version'), _tcombForked2.default.String, 'version');
      const moduleIdentifier = _assert(moduleDescriptor && moduleDescriptor.identifier, _tcombForked2.default.maybe(_tcombForked2.default.String), 'moduleIdentifier');

      // eslint-disable-next-line no-unused-vars
      const { context: unusedContext } = moduleHasReducers ? this.store.getState() : {};

      const initialData = _objectWithoutProperties(moduleHasReducers ? this.store.getState() : {}, ['context']);

      this.body = (0, _fody2.default)({
        Layout,
        layoutProps: {
          version,
          moduleIdentifier,
          scriptName: (() => {
            // TODO create alp-useragent with getter in context
            const ua = this.req.headers['user-agent'];

            if (agents.some(agent => {
              const res = agent.regexp.exec(ua);
              return res && res[1] >= agent.modernMinVersion;
            })) {
              return 'modern-browsers';
            }

            return 'es5';
          })(),
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
//# sourceMappingURL=index.js.map