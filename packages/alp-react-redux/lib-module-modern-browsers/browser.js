
import contentLoaded from 'content-loaded';
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

const renderApp = function renderApp(App) {
  return render(React.createElement(App), document.getElementById('react-app'));
};

export default (async function (app, App, { sharedReducers } = {}) {
  const ctx = app.createContext();
  let store;
  let moduleStoreReducer;

  const createStore = function createStore(ctx, moduleReducers) {
    moduleStoreReducer = createBrowserModuleStoreReducer(moduleReducers);

    const store = createBrowserStore(app, ctx, moduleStoreReducer.reducer, {
      sharedReducers,
      middlewares: [app.websocket && websocketMiddleware(app)].filter(Boolean)
    });

    return app.store = store, store;
  };

  const preRender = async function preRender(app) {
    const moduleVisitor = createModuleVisitor();

    const PreRenderWrappedApp = createAlpAppWrapper(app, {
      context: ctx,
      store: { getState: function getState() {
          return { ctx };
        } }
    });


    return await reactTreeWalker(React.createElement(PreRenderWrappedApp), moduleVisitor.visitor), moduleVisitor.getReducers();
  };

  const render = async function render(App) {
    let app = React.createElement(App);


    const moduleReducers = await preRender(app);

    store ? moduleStoreReducer.setReducers(moduleReducers) : store = createStore(ctx, moduleReducers);


    const WrappedApp = createAlpAppWrapper(app, {
      context: ctx,
      store,
      setModuleReducers: function setModuleReducers(reducers) {
        return moduleStoreReducer.set(store, reducers);
      }
    });

    renderApp(WrappedApp), logger.success('rendered');
  };

  if (app.websocket) {
    const loggerWebsocket = logger.child('websocket');
    loggerWebsocket.debug('register websocket redux:action'), app.websocket.on('redux:action', function (action) {
      loggerWebsocket.debug('dispatch action from websocket', action), store && store.dispatch(action);
    });
  }

  return await contentLoaded(), await render(App), render;
});
//# sourceMappingURL=browser.js.map