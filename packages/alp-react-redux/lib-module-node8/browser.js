import React from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import Logger from 'nightingale-logger';
import createAlpAppWrapper from './createAlpAppWrapper';
import createBrowserStore from './store/createBrowserStore';
import createModuleStoreReducer from './store/createModuleStoreReducer';
import { websocketMiddleware } from './websocket';

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

const renderApp = App => render(React.createElement(App), document.getElementById('react-app'));

export default ((app, { sharedReducers } = {}) => {
  const moduleStoreReducer = createModuleStoreReducer();
  const store = createBrowserStore(app, moduleStoreReducer.reducer, {
    sharedReducers,
    middlewares: [app.websocket && websocketMiddleware(app)].filter(Boolean)
  });

  app.store = store;

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

  const ctx = app.createContext();
  ctx.urlGenerator = () => null;

  return App => {
    const WrappedApp = createAlpAppWrapper(App, {
      context: ctx,
      app,
      store,
      setModuleReducers: reducers => moduleStoreReducer.set(store, reducers)
    });

    renderApp(WrappedApp);
    logger.success('rendered');
  };
});
//# sourceMappingURL=browser.js.map