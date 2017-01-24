var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import _t from 'tcomb-forked';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import render from 'fody';
import Logger from 'nightingale-logger';
import { createStore, combineReducers } from 'redux';
import AlpLayout from './layout/AlpLayout';
import AlpReactApp from './AlpReactApp';
import AlpReduxApp from './AlpReduxApp';
import * as alpReducers from './reducers';
import { ModuleDescriptorType } from './types';

export { AlpReactApp, AlpReduxApp };
export { Helmet } from 'fody';
export { combineReducers } from 'redux';
export { connect } from 'react-redux';
import _createPureStatelessComponent from 'react-pure-stateless-component';
export { _createPureStatelessComponent as createPureStatelessComponent };

export { createAction, createReducer, createLoader } from './utils';
export { AlpHtml, AlpLayout, AlpHead, AlpBody } from './layout';

throw new Error('Not supposed to be loaded browser-side.');

var logger = new Logger('alp:react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
var agents = [{ name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 14 }, { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 47 }, { name: 'Chrome', regexp: /chrom(?:e|ium)\/([\d]+)/i, modernMinVersion: 51 }, // also works for opera.
{ name: 'Safari', regexp: /version\/([\d\w.-]+).*safari/i, modernMinVersion: 10 }];

var OptionsType = _t.interface({
  Layout: _t.maybe(_t.Any),
  sharedReducers: _t.maybe(_t.Object)
}, {
  name: 'OptionsType',
  strict: true
});

export default function alpReactRedux({ Layout = AlpLayout, sharedReducers = {} } = {}) {
  _assert({
    Layout,
    sharedReducers
  }, OptionsType, '{ Layout = AlpLayout, sharedReducers = {} }');

  return function (app) {
    _assert(app, _t.Object, 'app');

    app.context.render = function (moduleDescriptor, data, _loaded) {
      var _this = this;

      _assert(moduleDescriptor, ModuleDescriptorType, 'moduleDescriptor');

      _assert(data, _t.maybe(_t.Object), 'data');

      logger.debug('render view', { data });

      if (!_loaded && moduleDescriptor.loader) {
        // const _state = data;
        return moduleDescriptor.loader(Object.create(null), data).then(function (data) {
          return _this.render(moduleDescriptor, data, true);
        });
      }

      var moduleHasReducers = !!(moduleDescriptor.reducer || moduleDescriptor.reducers);
      var reducer = moduleDescriptor.reducer ? moduleDescriptor.reducer : combineReducers(_extends({}, moduleDescriptor.reducers, alpReducers, sharedReducers));

      if (reducer) {
        this.store = createStore(reducer, _extends({ context: this }, data));
      }

      var version = this.config.get('version');
      var moduleIdentifier = moduleDescriptor && moduleDescriptor.identifier;

      // eslint-disable-next-line no-unused-vars
      var { context: unusedContext } = moduleHasReducers ? this.store.getState() : {};

      var initialData = _objectWithoutProperties(moduleHasReducers ? this.store.getState() : {}, ['context']);

      this.body = render({
        Layout,
        layoutProps: {
          version,
          moduleIdentifier,
          scriptName: function () {
            // TODO create alp-useragent with getter in context
            var ua = _this.req.headers['user-agent'];

            if (agents.some(function (agent) {
              var res = agent.regexp.exec(ua);
              return res && res[1] >= agent.modernMinVersion;
            })) {
              return 'modern-browsers';
            }

            return 'es5';
          }(),
          initialBrowserContext: this.computeInitialContextForBrowser(),
          initialData: moduleHasReducers ? initialData : null
        },

        App: reducer ? AlpReduxApp : AlpReactApp,
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

var loggerWebsocket = logger.child('websocket');

export function emitAction(to, action) {
  loggerWebsocket.debug('emitAction', action);
  to.emit('redux:action', action);
}

function _assert(x, type, name) {
  if (false) {
    _t.fail = function (message) {
      console.warn(message);
    };
  }

  if (_t.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _t.fail('Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=index.js.map