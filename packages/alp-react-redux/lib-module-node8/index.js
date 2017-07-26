import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import Logger from 'nightingale-logger';
import isModernBrowser from 'modern-browsers';
import htmlLayout from './layout/htmlLayout';
import createAlpAppWrapper from './createAlpAppWrapper';
import createServerStore from './store/createServerStore';
import createModuleStoreReducer from './store/createModuleStoreReducer';

export { Helmet };
export { combineReducers } from 'redux';
export { connect } from 'react-redux';
export { createAction, createReducer, createLoader, classNames, createPureStatelessComponent, identityReducer } from './utils/index';
import _AlpModule from './module/AlpModule';
export { _AlpModule as AlpModule };
import _AlpReduxModule from './module/AlpReduxModuleServer';
export { _AlpReduxModule as AlpReduxModule };
import _Body from './layout/Body';
export { _Body as Body };
import _AppContainer from './layout/AppContainer';
export { _AppContainer as AppContainer };


const logger = new Logger('alp:react-redux');

const renderHtml = (App, options) => {
  const content = renderToString(React.createElement(App));
  const helmet = Helmet.renderStatic();
  return htmlLayout(helmet, content, options);
};

export default ((App, options = {}) => ctx => {
  const version = ctx.config.get('version');
  // TODO create alp-useragent with getter in context
  const ua = ctx.req.headers['user-agent'];
  const name = isModernBrowser(ua) ? 'modern-browsers' : 'es5';
  ctx.urlGenerator = () => null;

  const moduleStoreReducer = createModuleStoreReducer();
  const store = createServerStore(ctx, moduleStoreReducer.reducer, {
    sharedReducers: options.sharedReducers
  });

  const WrappedApp = createAlpAppWrapper(App, {
    context: ctx,
    app: ctx.app,
    store,
    setModuleReducers: reducers => moduleStoreReducer.set(store, reducers)
  });

  ctx.body = renderHtml(WrappedApp, {
    version,
    scriptName: options.scriptName !== undefined ? options.scriptName : name,
    styleName: options.styleName !== undefined ? options.styleName : name,
    polyfillFeatures: options.polyfillFeatures,
    initialData: store.getState()
  });
});

const loggerWebsocket = logger.child('websocket');

export function emitAction(to, action) {
  loggerWebsocket.debug('emitAction', action);
  to.emit('redux:action', action);
}
//# sourceMappingURL=index.js.map