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

const logger = new Logger('alp:react-redux');

const renderToStringApp = (App, appProps, View, props) => {
  const app = React.createElement(
    App,
    appProps,
    React.createElement(View, props)
  );
  return renderToString(app);
};

const renderHtml = ({ App, appProps, View, props, layoutOptions }) => {
  const content = renderToStringApp(App, appProps, View, props);
  const helmet = Helmet.renderStatic();
  return `<!doctype html>\n${htmlLayout(helmet, content, layoutOptions)}`;
};

export default function alpReactRedux({ layoutBody, appHOC, sharedReducers = {} } = {}) {
  const AlpReactAppLayout = appHOC ? appHOC(AlpReactApp) : AlpReactApp;
  const AlpReduxAppLayout = appHOC ? appHOC(AlpReduxApp) : AlpReduxApp;

  return app => {
    app.context.render = function (moduleDescriptor, data, _loaded) {
      logger.debug('render view', { data });

      if (!_loaded && moduleDescriptor.loader) {
        // const _state = data;
        return moduleDescriptor.loader(Object.create(null), data).then(data => this.render(moduleDescriptor, data, true));
      }

      const moduleHasReducers = !!(moduleDescriptor.reducer || moduleDescriptor.reducers);
      const reducer = moduleDescriptor.reducer ? moduleDescriptor.reducer : combineReducers(Object.assign({}, moduleDescriptor.reducers, alpReducers, sharedReducers));

      if (reducer) {
        this.store = createStore(reducer, Object.assign({ context: this }, data));
      }

      const version = this.config.get('version');
      const moduleIdentifier = moduleDescriptor && moduleDescriptor.identifier;

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