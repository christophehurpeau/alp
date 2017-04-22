import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import Logger from 'nightingale-logger';
import isModernBrowser from 'modern-browsers';
import { createStore, combineReducers } from 'redux';
import htmlLayout from './layout/htmlLayout';
import AlpReactApp from './layout/AlpReactApp';
import AlpReduxApp from './layout/AlpReduxApp';
import * as alpReducers from './reducers';


export { AlpReactApp, AlpReduxApp, Helmet };
export { combineReducers } from 'redux';
export { connect } from 'react-redux';
export { createAction, createReducer, createLoader, classNames, createPureStatelessComponent } from './utils';

throw new Error('Not supposed to be loaded browser-side.');

var logger = new Logger('alp:react-redux');

var renderToStringApp = function renderToStringApp(App, appProps, View, props) {
  var app = React.createElement(
    App,
    appProps,
    React.createElement(View, props)
  );
  return renderToString(app);
};

var renderHtml = function renderHtml(_ref) {
  var App = _ref.App,
      appProps = _ref.appProps,
      View = _ref.View,
      props = _ref.props,
      layoutOptions = _ref.layoutOptions;

  var content = renderToStringApp(App, appProps, View, props);
  var helmet = Helmet.renderStatic();
  return '<!doctype html>\n' + htmlLayout(helmet, content, layoutOptions);
};

export default function alpReactRedux() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      layoutBody = _ref2.layoutBody,
      appHOC = _ref2.appHOC,
      _ref2$sharedReducers = _ref2.sharedReducers,
      sharedReducers = _ref2$sharedReducers === undefined ? {} : _ref2$sharedReducers;

  var AlpReactAppLayout = appHOC ? appHOC(AlpReactApp) : AlpReactApp;
  var AlpReduxAppLayout = appHOC ? appHOC(AlpReduxApp) : AlpReduxApp;

  return function (app) {
    app.context.render = function (moduleDescriptor, data, _loaded) {
      var _this = this;

      logger.debug('render view', { data: data });

      if (!_loaded && moduleDescriptor.loader) {
        // const _state = data;
        return moduleDescriptor.loader(Object.create(null), data).then(function (data) {
          return _this.render(moduleDescriptor, data, true);
        });
      }

      var moduleHasReducers = !!(moduleDescriptor.reducer || moduleDescriptor.reducers);
      var reducer = moduleDescriptor.reducer ? moduleDescriptor.reducer : combineReducers(Object.assign({}, moduleDescriptor.reducers, alpReducers, sharedReducers));

      if (reducer) {
        this.store = createStore(reducer, Object.assign({ context: this }, data));
      }

      var version = this.config.get('version');
      var moduleIdentifier = moduleDescriptor && moduleDescriptor.identifier;

      // eslint-disable-next-line no-unused-vars

      var _ref3 = moduleHasReducers ? this.store.getState() : {},
          unusedContext = _ref3.context,
          initialData = _objectWithoutProperties(_ref3, ['context']);

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