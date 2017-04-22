var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'index.jsx',
    _this = this;

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import Logger from 'nightingale-logger';
import isModernBrowser from 'modern-browsers';
import { createStore, combineReducers } from 'redux';
import htmlLayout, { LayoutOptionsType as _LayoutOptionsType } from './layout/htmlLayout';
import AlpReactApp from './layout/AlpReactApp';
import AlpReduxApp from './layout/AlpReduxApp';
import * as alpReducers from './reducers';
import { ReactComponentType as _ReactComponentType, ModuleDescriptorType as _ModuleDescriptorType } from './types';

import t from 'flow-runtime';
var ReactComponentType = t.tdz(function () {
  return _ReactComponentType;
});
var ModuleDescriptorType = t.tdz(function () {
  return _ModuleDescriptorType;
});
var LayoutOptionsType = t.tdz(function () {
  return _LayoutOptionsType;
});
export { AlpReactApp, AlpReduxApp, Helmet };
export { combineReducers } from 'redux';
export { connect } from 'react-redux';
export { createAction, createReducer, createLoader, classNames, createPureStatelessComponent } from './utils';

throw new Error('Not supposed to be loaded browser-side.');

var logger = new Logger('alp:react-redux');

var renderToStringApp = function renderToStringApp(App, appProps, View, props) {
  var _returnType = t.return(t.string());

  var app = React.createElement(
    App,
    _extends({}, appProps, {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 22
      }
    }),
    React.createElement(View, _extends({}, props, {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 22
      }
    }))
  );
  return _returnType.assert(renderToString(app));
};

var AppOptionsType = t.type('AppOptionsType', t.exactObject(t.property('App', t.ref(ReactComponentType)), t.property('appProps', t.object()), t.property('View', t.ref(ReactComponentType)), t.property('props', t.nullable(t.object())), t.property('layoutOptions', t.nullable(t.ref(LayoutOptionsType)))));


var renderHtml = function renderHtml(_arg) {
  var _AppOptionsType$asser = AppOptionsType.assert(_arg),
      App = _AppOptionsType$asser.App,
      appProps = _AppOptionsType$asser.appProps,
      View = _AppOptionsType$asser.View,
      props = _AppOptionsType$asser.props,
      layoutOptions = _AppOptionsType$asser.layoutOptions;

  var content = renderToStringApp(App, appProps, View, props);
  var helmet = Helmet.renderStatic();
  return '<!doctype html>\n' + htmlLayout(helmet, content, layoutOptions);
};

var OptionsType = t.type('OptionsType', t.exactObject(t.property('layoutBody', t.nullable(t.function())), t.property('appHOC', t.nullable(t.function())), t.property('sharedReducers', t.nullable(t.object()))));


export default function alpReactRedux() {
  var _arg2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _OptionsType$assert = OptionsType.assert(_arg2),
      layoutBody = _OptionsType$assert.layoutBody,
      appHOC = _OptionsType$assert.appHOC,
      _OptionsType$assert$s = _OptionsType$assert.sharedReducers,
      sharedReducers = _OptionsType$assert$s === undefined ? {} : _OptionsType$assert$s;

  var AlpReactAppLayout = appHOC ? appHOC(AlpReactApp) : AlpReactApp;
  var AlpReduxAppLayout = appHOC ? appHOC(AlpReduxApp) : AlpReduxApp;

  return function (app) {
    var _appType = t.object();

    t.param('app', _appType).assert(app);

    app.context.render = function (moduleDescriptor, data, _loaded) {
      var _this2 = this;

      var _moduleDescriptorType = t.ref(ModuleDescriptorType);

      var _dataType = t.nullable(t.object());

      t.param('moduleDescriptor', _moduleDescriptorType).assert(moduleDescriptor);
      t.param('data', _dataType).assert(data);

      logger.debug('render view', { data: data });

      if (!_loaded && moduleDescriptor.loader) {
        // const _state = data;
        return moduleDescriptor.loader(Object.create(null), data).then(function (data) {
          return _this2.render(moduleDescriptor, data, true);
        });
      }

      var moduleHasReducers = !!(moduleDescriptor.reducer || moduleDescriptor.reducers);
      var reducer = moduleDescriptor.reducer ? moduleDescriptor.reducer : combineReducers(Object.assign({}, moduleDescriptor.reducers, alpReducers, sharedReducers));

      if (reducer) {
        this.store = createStore(reducer, Object.assign({ context: this }, data));
      }

      var version = t.string().assert(this.config.get('version'));
      var moduleIdentifier = t.nullable(t.string()).assert(moduleDescriptor && moduleDescriptor.identifier);

      // eslint-disable-next-line no-unused-vars

      var _ref = moduleHasReducers ? this.store.getState() : {},
          unusedContext = _ref.context,
          initialData = _objectWithoutProperties(_ref, ['context']);

      // TODO create alp-useragent with getter in context


      var ua = this.req.headers['user-agent'];
      var name = isModernBrowser(ua) ? 'modern-browsers' : 'es5';

      this.body = renderHtml({
        layoutOptions: {
          layoutBody: layoutBody,
          version: version,
          moduleIdentifier: moduleIdentifier,
          scriptName: name,
          styleName: name,
          initialBrowserContext: this.computeInitialContextForBrowser(),
          initialData: moduleHasReducers ? initialData : null
        },

        App: reducer ? AlpReduxAppLayout : AlpReactAppLayout,
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
//# sourceMappingURL=index.js.map