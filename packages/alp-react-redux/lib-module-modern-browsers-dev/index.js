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
const ReactComponentType = t.tdz(function () {
  return _ReactComponentType;
});
const ModuleDescriptorType = t.tdz(function () {
  return _ModuleDescriptorType;
});
const LayoutOptionsType = t.tdz(function () {
  return _LayoutOptionsType;
});
export { AlpReactApp, AlpReduxApp, Helmet };
export { combineReducers } from 'redux';
export { connect } from 'react-redux';
export { createAction, createReducer, createLoader, classNames, createPureStatelessComponent } from './utils';

throw new Error('Not supposed to be loaded browser-side.');

const logger = new Logger('alp:react-redux');

const renderToStringApp = function renderToStringApp(App, appProps, View, props) {
  const _returnType = t.return(t.string());

  const app = React.createElement(
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

const AppOptionsType = t.type('AppOptionsType', t.exactObject(t.property('App', t.ref(ReactComponentType)), t.property('appProps', t.object()), t.property('View', t.ref(ReactComponentType)), t.property('props', t.nullable(t.object())), t.property('layoutOptions', t.nullable(t.ref(LayoutOptionsType)))));


const renderHtml = function renderHtml(_arg) {
  let { App, appProps, View, props, layoutOptions } = AppOptionsType.assert(_arg);

  const content = renderToStringApp(App, appProps, View, props);
  const helmet = Helmet.renderStatic();
  return `<!doctype html>\n${htmlLayout(helmet, content, layoutOptions)}`;
};

const OptionsType = t.type('OptionsType', t.exactObject(t.property('layoutBody', t.nullable(t.function())), t.property('appHOC', t.nullable(t.function())), t.property('sharedReducers', t.nullable(t.object()))));


export default function alpReactRedux(_arg2 = {}) {
  let { layoutBody, appHOC, sharedReducers = {} } = OptionsType.assert(_arg2);

  const AlpReactAppLayout = appHOC ? appHOC(AlpReactApp) : AlpReactApp;
  const AlpReduxAppLayout = appHOC ? appHOC(AlpReduxApp) : AlpReduxApp;

  return function (app) {
    let _appType = t.object();

    t.param('app', _appType).assert(app);

    app.context.render = function (moduleDescriptor, data, _loaded) {
      var _this2 = this;

      let _moduleDescriptorType = t.ref(ModuleDescriptorType);

      let _dataType = t.nullable(t.object());

      t.param('moduleDescriptor', _moduleDescriptorType).assert(moduleDescriptor);
      t.param('data', _dataType).assert(data);

      logger.debug('render view', { data });

      if (!_loaded && moduleDescriptor.loader) {
        // const _state = data;
        return moduleDescriptor.loader(Object.create(null), data).then(function (data) {
          return _this2.render(moduleDescriptor, data, true);
        });
      }

      const moduleHasReducers = !!(moduleDescriptor.reducer || moduleDescriptor.reducers);
      const reducer = moduleDescriptor.reducer ? moduleDescriptor.reducer : combineReducers(Object.assign({}, moduleDescriptor.reducers, alpReducers, sharedReducers));

      if (reducer) {
        this.store = createStore(reducer, Object.assign({ context: this }, data));
      }

      const version = t.string().assert(this.config.get('version'));
      const moduleIdentifier = t.nullable(t.string()).assert(moduleDescriptor && moduleDescriptor.identifier);

      // eslint-disable-next-line no-unused-vars
      const _ref = moduleHasReducers ? this.store.getState() : {},
            { context: unusedContext } = _ref,
            initialData = _objectWithoutProperties(_ref, ['context']);

      // TODO create alp-useragent with getter in context
      const ua = this.req.headers['user-agent'];
      const name = isModernBrowser(ua) ? 'modern-browsers' : 'es5';

      this.body = renderHtml({
        layoutOptions: {
          layoutBody,
          version,
          moduleIdentifier,
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

const loggerWebsocket = logger.child('websocket');

export function emitAction(to, action) {
  loggerWebsocket.debug('emitAction', action);
  to.emit('redux:action', action);
}
//# sourceMappingURL=index.js.map