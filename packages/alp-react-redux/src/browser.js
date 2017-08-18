import BrowserAppContainer from 'alp-dev/BrowserAppContainer';
import contentLoaded from 'content-loaded';
import React from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import reactTreeWalker from 'react-tree-walker';
import Logger from 'nightingale-logger/src';
import createAlpAppWrapper from './createAlpAppWrapper';
import createBrowserStore from './store/createBrowserStore';
import createBrowserModuleStoreReducer from './store/createBrowserModuleStoreReducer';
import { websocketMiddleware } from './websocket';
import createModuleVisitor from './module/createModuleVisitor';

export { Helmet };
export { combineReducers } from 'redux/src';
export { connect } from 'react-redux/src';
export {
  createAction,
  createReducer,
  createLoader,
  classNames,
  createPureStatelessComponent,
  identityReducer,
} from './utils/index';
export AlpModule from './module/AlpModule';
export AlpReduxModule from './module/AlpReduxModuleBrowser';
export Body from './layout/Body';
export AppContainer from './layout/AppContainer';

const logger = new Logger('alp:react-redux');

const renderApp = App => render(React.createElement(App), document.getElementById('react-app'));

export default async (app, App, { sharedReducers } = {}) => {
  const ctx = app.createContext();
  let store;
  let moduleStoreReducer;

  const createStore = (ctx, moduleReducers) => {
    moduleStoreReducer = createBrowserModuleStoreReducer(moduleReducers);
    const store = createBrowserStore(app, ctx, moduleStoreReducer.reducer, {
      sharedReducers,
      middlewares: [app.websocket && websocketMiddleware(app)].filter(Boolean),
    });
    app.store = store;
    return store;
  };

  const preRender = async app => {
    const moduleVisitor = createModuleVisitor();
    const preRenderStore = { getState: () => ({ ctx }) };
    const PreRenderWrappedApp = createAlpAppWrapper(app, {
      context: ctx,
      store: preRenderStore,
    });
    await reactTreeWalker(React.createElement(PreRenderWrappedApp), moduleVisitor.visitor);

    return moduleVisitor.getReducers();
  };

  const render = async App => {
    let app = React.createElement(App);
    if (!PRODUCTION) {
      app = React.createElement(BrowserAppContainer, {}, app);
    }

    const moduleReducers = await preRender(app);

    if (!PRODUCTION) {
      store = createStore(ctx, moduleReducers);
    } else {
      // in DEV
      // eslint-disable-next-line no-lonely-if
      if (!store) {
        store = createStore(ctx, moduleReducers);
      } else {
        moduleStoreReducer.setReducers(moduleReducers);
      }
    }

    const WrappedApp = createAlpAppWrapper(app, {
      context: ctx,
      store,
      setModuleReducers: reducers => moduleStoreReducer.set(store, reducers),
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

  await contentLoaded();
  await render(App);

  return render;
};
