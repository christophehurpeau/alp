import contentLoaded from 'content-loaded';
import React from 'react';
import { hydrate } from 'react-dom';
import Helmet from 'react-helmet';
import reactTreeWalker from 'react-tree-walker';
import Logger from 'nightingale-logger';
// eslint-disable-next-line import/no-extraneous-dependencies

import createAlpAppWrapper from './createAlpAppWrapper';
import createBrowserStore from './store/createBrowserStore';
import createBrowserModuleStoreReducer from './store/createBrowserModuleStoreReducer';
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

const _renderApp = function _renderApp(App) {
  return hydrate(React.createElement(App), document.getElementById('react-app'));
};

const preRender = async function preRender(ctx, appElement) {
  const moduleVisitor = createModuleVisitor();

  const PreRenderWrappedApp = createAlpAppWrapper(appElement, {
    context: ctx,
    store: { getState: function getState() {
        return { ctx };
      } }
  });
  await reactTreeWalker(React.createElement(PreRenderWrappedApp), moduleVisitor.visitor);

  return moduleVisitor.getReducers();
};

export default (function (app) {
  app.reduxReducers = {
    loading: function loading(state = 0, action) {
      if (action.meta && action.meta.loading !== undefined) {
        return state + (action.meta.loading ? 1 : -1);
      }
      return state;
    }
  };
  app.reduxMiddlewares = [];

  return {
    renderApp: async function renderApp(App, { middlewares = [], sharedReducers } = {}) {
      let store;
      let moduleStoreReducer;

      const createStore = function createStore(ctx, moduleReducers) {
        moduleStoreReducer = createBrowserModuleStoreReducer(moduleReducers);
        const store = createBrowserStore(app, ctx, moduleStoreReducer.reducer, {
          middlewares,
          sharedReducers
        });
        app.store = store;
        window.store = store;
        return store;
      };

      const ctx = app.createContext();

      const render = async function render(App) {
        let appElement = React.createElement(App);


        const moduleReducers = await preRender(ctx, appElement);

        // in DEV
        // eslint-disable-next-line no-lonely-if
        if (!store) {
          store = createStore(ctx, moduleReducers);
        } else {
          moduleStoreReducer.setReducers(moduleReducers);
        }


        const WrappedApp = createAlpAppWrapper(appElement, {
          context: ctx,
          store,
          setModuleReducers: function setModuleReducers(reducers) {
            return moduleStoreReducer.set(store, reducers);
          }
        });

        await contentLoaded();
        _renderApp(WrappedApp);
        logger.success('rendered');
      };

      await render(App);

      return render;
    }
  };
});
//# sourceMappingURL=browser.js.map