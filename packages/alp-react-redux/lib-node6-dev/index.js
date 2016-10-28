'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLoader = exports.createReducer = exports.createAction = exports.createPureStatelessComponent = exports.connect = exports.combineReducers = exports.Helmet = undefined;

var _fody = require('fody');

Object.defineProperty(exports, 'Helmet', {
  enumerable: true,
  get: function get() {
    return _fody.Helmet;
  }
});

var _redux = require('redux');

Object.defineProperty(exports, 'combineReducers', {
  enumerable: true,
  get: function get() {
    return _redux.combineReducers;
  }
});

var _reactRedux = require('react-redux');

Object.defineProperty(exports, 'connect', {
  enumerable: true,
  get: function get() {
    return _reactRedux.connect;
  }
});
exports.default = alpReactRedux;
exports.emitAction = emitAction;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _fody2 = _interopRequireDefault(_fody);

var _fodyReduxApp = require('fody-redux-app');

var _fodyReduxApp2 = _interopRequireDefault(_fodyReduxApp);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _reactPureStatelessComponent = require('react-pure-stateless-component');

var _reactPureStatelessComponent2 = _interopRequireDefault(_reactPureStatelessComponent);

var _createAction2 = require('./createAction');

var _createAction3 = _interopRequireDefault(_createAction2);

var _createReducer2 = require('./createReducer');

var _createReducer3 = _interopRequireDefault(_createReducer2);

var _createLoader2 = require('./createLoader');

var _createLoader3 = _interopRequireDefault(_createLoader2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createPureStatelessComponent = _reactPureStatelessComponent2.default;
exports.createAction = _createAction3.default;
exports.createReducer = _createReducer3.default;
exports.createLoader = _createLoader3.default;


const logger = new _nightingaleLogger2.default('alp:react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
const agents = [{ name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 14 }, { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 47 }, { name: 'Chrome', regexp: /chrome\/([\d]+)/i, modernMinVersion: 51 }, // also works for opera.
{ name: 'Chromium', regexp: /chromium\/([\d]+)/i, modernMinVersion: 51 }, { name: 'Safari', regexp: /safari.*version\/([\d\w\.\-]+)/i, modernMinVersion: 10 }];

function alpReactRedux(Html) {
  return app => {
    _assert(app, _tcombForked2.default.Object, 'app');

    app.context.render = function (moduleDescriptor, data, _loaded) {
      logger.debug('render view', { data });

      if (!_loaded && moduleDescriptor.loader) {
        // const _state = data;
        return moduleDescriptor.loader(Object.create(null), data).then(data => this.render(moduleDescriptor, data, true));
      }

      if (moduleDescriptor.reducer) {
        this.store = (0, _redux.createStore)(moduleDescriptor.reducer, data);
      }

      this.body = (0, _fody2.default)({
        htmlData: {
          context: this,
          moduleDescriptor,
          get scriptName() {
            // TODO create alp-useragent with getter in context
            const ua = this.context.req.headers['user-agent'];

            if (agents.some(agent => {
              const res = agent.regexp.exec(ua);
              return res && res[1] >= agent.modernMinVersion;
            })) {
              return 'modern-browsers';
            }

            return 'es5';
          },
          initialBrowserContext: this.computeInitialContextForBrowser()
        },
        context: this,
        View: moduleDescriptor.View,
        data: moduleDescriptor.reducer ? undefined : data,
        initialData: moduleDescriptor.reducer ? () => this.store.getState() : () => null,
        Html,
        App: moduleDescriptor.reducer ? _fodyReduxApp2.default : _fody.App
      });
    };
  };
}

function emitAction(to, action) {
  to.emit('redux:action', action);
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map