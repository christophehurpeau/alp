'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stylesheet = exports.Script = exports.createLoader = exports.createReducer = exports.createAction = exports.createPureStatelessComponent = exports.connect = exports.combineReducers = exports.Helmet = exports.AlpReduxApp = exports.AlpReactApp = exports.AlpHelmetHtml = undefined;

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

var _fody2 = _interopRequireDefault(_fody);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _AlpHelmetHtml = require('./AlpHelmetHtml');

var _AlpHelmetHtml2 = _interopRequireDefault(_AlpHelmetHtml);

var _AlpReactApp = require('./AlpReactApp');

var _AlpReactApp2 = _interopRequireDefault(_AlpReactApp);

var _AlpReduxApp = require('./AlpReduxApp');

var _AlpReduxApp2 = _interopRequireDefault(_AlpReduxApp);

var _reactPureStatelessComponent = require('react-pure-stateless-component');

var _reactPureStatelessComponent2 = _interopRequireDefault(_reactPureStatelessComponent);

var _createAction2 = require('./createAction');

var _createAction3 = _interopRequireDefault(_createAction2);

var _createReducer2 = require('./createReducer');

var _createReducer3 = _interopRequireDefault(_createReducer2);

var _createLoader2 = require('./createLoader');

var _createLoader3 = _interopRequireDefault(_createLoader2);

var _Script2 = require('./helmet/Script');

var _Script3 = _interopRequireDefault(_Script2);

var _Stylesheet2 = require('./helmet/Stylesheet');

var _Stylesheet3 = _interopRequireDefault(_Stylesheet2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.AlpHelmetHtml = _AlpHelmetHtml2.default;
exports.AlpReactApp = _AlpReactApp2.default;
exports.AlpReduxApp = _AlpReduxApp2.default;
exports.createPureStatelessComponent = _reactPureStatelessComponent2.default;
exports.createAction = _createAction3.default;
exports.createReducer = _createReducer3.default;
exports.createLoader = _createLoader3.default;
exports.Script = _Script3.default;
exports.Stylesheet = _Stylesheet3.default;


const logger = new _nightingaleLogger2.default('alp:react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
const agents = [{ name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 14 }, { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 47 }, { name: 'Chrome', regexp: /chrom(?:e|ium)\/([\d]+)/i, modernMinVersion: 51 }, // also works for opera.
{ name: 'Safari', regexp: /version\/([\d\w.-]+).*safari/i, modernMinVersion: 10 }];

function alpReactRedux() {
  let Html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _AlpHelmetHtml2.default;

  return app => {
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
        Html,
        App: moduleDescriptor.reducer ? _AlpReduxApp2.default : _AlpReactApp2.default,
        appProps: {
          store: this.store,
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
          initialBrowserContext: this.computeInitialContextForBrowser(),
          initialData: moduleDescriptor.reducer ? this.store.getState() : null
        },
        View: moduleDescriptor.View,
        props: moduleDescriptor.reducer ? undefined : data
      });
    };
  };
}

function emitAction(to, action) {
  to.emit('redux:action', action);
}
//# sourceMappingURL=index.js.map