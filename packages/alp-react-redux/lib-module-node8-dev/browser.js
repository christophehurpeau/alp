import BrowserAppContainer from 'alp-dev/BrowserAppContainer';
import React from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import reactTreeWalker from 'react-tree-walker';
import Logger from 'nightingale-logger';
import createAlpAppWrapper from './createAlpAppWrapper';
import createBrowserStore from './store/createBrowserStore';
import createBrowserModuleStoreReducer from './store/createBrowserModuleStoreReducer';
import { websocketMiddleware } from './websocket';
import createModuleVisitor from './module/createModuleVisitor';

export { Helmet };
export { combineReducers } from 'redux';
export { connect } from 'react-redux';
export { createAction, createReducer, createLoader, classNames, createPureStatelessComponent, identityReducer } from './utils/index';
import _AlpModule from './module/AlpModule';
export { _AlpModule as AlpModule };
import _AlpReduxModule from './module/AlpReduxModuleBrowser';
export { _AlpReduxModule as AlpReduxModule };
import _Body from './layout/Body';
export { _Body as Body };
import _AppContainer from './layout/AppContainer';
export { _AppContainer as AppContainer };


const logger = new Logger('alp:react-redux');

const renderApp = App => render(React.createElement(App), document.getElementById('react-app'));

export default (async function browser(app, App, { sharedReducers } = {}) {
  const ctx = app.createContext();
  let store;
  let moduleStoreReducer;

  const createStore = (ctx, moduleReducers) => {
    moduleStoreReducer = createBrowserModuleStoreReducer(moduleReducers);
    const store = createBrowserStore(app, ctx, moduleStoreReducer.reducer, {
      sharedReducers,
      middlewares: [app.websocket && websocketMiddleware(app)].filter(Boolean)
    });
    app.store = store;
    return store;
  };

  const preRender = async app => {
    const moduleVisitor = createModuleVisitor();

    const PreRenderWrappedApp = createAlpAppWrapper(app, {
      context: ctx,
      store: { getState: () => ({ ctx }) }
    });
    await reactTreeWalker(React.createElement(PreRenderWrappedApp), moduleVisitor.visitor);

    return moduleVisitor.getReducers();
  };

  const render = async App => {
    let app = React.createElement(App);

    app = React.createElement(BrowserAppContainer, {}, app);


    const moduleReducers = await preRender(app);

    store = createStore(ctx, moduleReducers);


    const WrappedApp = createAlpAppWrapper(app, {
      context: ctx,
      store,
      setModuleReducers: reducers => moduleStoreReducer.set(store, reducers)
    });

    renderApp(WrappedApp);
    logger.success('rendered');
  };

  if (app.websocket) {
    const loggerWebsocket = logger.child('websocket');
    loggerWebsocket.debug('register websocket redux:action');
    app.websocket.on('redux:action', action => {
      loggerWebsocket.debug('dispatch action from websocket', action);
      if (store) {
        store.dispatch(action);
      }
    });
  }

  await render(App);

  return render;
});
//# sourceMappingURL=browser.js.map