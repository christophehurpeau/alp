import React from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import Logger from 'nightingale-logger/src';
import createAlpAppWrapper from './createAlpAppWrapper';
import createBrowserStore from './store/createBrowserStore';
import createModuleStoreReducer from './store/createModuleStoreReducer';
import { websocketMiddleware } from './websocket';

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
export AlpReduxModule from './module/AlpReduxModuleServer';
export Body from './layout/Body';
export AppContainer from './layout/AppContainer';

const logger = new Logger('alp:react-redux');

const renderApp = App => render(React.createElement(App), document.getElementById('react-app'));

export default (app, { sharedReducers } = {}) => {
  const moduleStoreReducer = createModuleStoreReducer();
  const store = createBrowserStore(app, moduleStoreReducer.reducer, {
    sharedReducers,
    middlewares: [app.websocket && websocketMiddleware(app)].filter(Boolean),
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
      setModuleReducers: reducers => moduleStoreReducer.set(store, reducers),
    });

    renderApp(WrappedApp);
    logger.success('rendered');
  };
};
