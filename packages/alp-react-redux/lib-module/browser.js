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


var logger = new Logger('alp:react-redux');

var renderApp = function renderApp(App) {
  return render(React.createElement(App), document.getElementById('react-app'));
};

export default (function (app) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      sharedReducers = _ref.sharedReducers;

  var moduleStoreReducer = createModuleStoreReducer();
  var store = createBrowserStore(app, moduleStoreReducer.reducer, {
    sharedReducers: sharedReducers,
    middlewares: [app.websocket && websocketMiddleware(app)].filter(Boolean)
  });

  app.store = store;

  if (app.websocket) {
    var loggerWebsocket = logger.child('websocket');
    loggerWebsocket.debug('register websocket redux:action');
    app.websocket.on('redux:action', function (action) {
      loggerWebsocket.debug('dispatch action from websocket', action);
      if (store) {
        store.dispatch(action);
      }
    });
  }

  var ctx = app.createContext();
  ctx.urlGenerator = function () {
    return null;
  };

  return function (App) {
    var WrappedApp = createAlpAppWrapper(App, {
      context: ctx,
      app: app,
      store: store,
      setModuleReducers: function setModuleReducers(reducers) {
        return moduleStoreReducer.set(store, reducers);
      }
    });

    renderApp(WrappedApp);
    logger.success('rendered');
  };
});
//# sourceMappingURL=browser.js.map