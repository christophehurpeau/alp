// eslint-disable-next-line
import BrowserAppContainer from 'pobpack-browser/BrowserAppContainer';
import contentLoaded from 'content-loaded';
import React from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import reactTreeWalker from 'react-tree-walker';
import Logger from 'nightingale-logger/src';
import createAlpAppWrapper from './createAlpAppWrapper';
import createBrowserStore from './store/createBrowserStore';
import createBrowserModuleStoreReducer from './store/createBrowserModuleStoreReducer';
import createModuleVisitor from './module/createModuleVisitor';
import type { ReduxActionType } from './types';

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

const preRender = async (ctx, appElement) => {
  const moduleVisitor = createModuleVisitor();
  const preRenderStore = { getState: () => ({ ctx }) };
  const PreRenderWrappedApp = createAlpAppWrapper(appElement, {
    context: ctx,
    store: preRenderStore,
  });
  await reactTreeWalker(React.createElement(PreRenderWrappedApp), moduleVisitor.visitor);

  return moduleVisitor.getReducers();
};

export default app => {
  app.reduxReducers = {
    loading: (state: ?number = 0, action: ReduxActionType) => {
      if (action.meta && action.meta.loading !== undefined) {
        return state + (action.meta.loading ? 1 : -1);
      }
      return state;
    },
  };
  app.reduxMiddlewares = [];

  return {
    renderApp: async (App, { middlewares = [], sharedReducers } = {}) => {
      let store;
      let moduleStoreReducer;

      const createStore = (ctx, moduleReducers) => {
        moduleStoreReducer = createBrowserModuleStoreReducer(moduleReducers);
        const store = createBrowserStore(app, ctx, moduleStoreReducer.reducer, {
          middlewares,
          sharedReducers,
        });
        app.store = store;
        window.store = store;
        return store;
      };

      const ctx = app.createContext();

      const render = async App => {
        let appElement = React.createElement(App);
        if (!PRODUCTION) {
          appElement = React.createElement(BrowserAppContainer, {}, appElement);
        }

        const moduleReducers = await preRender(ctx, appElement);

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

        const WrappedApp = createAlpAppWrapper(appElement, {
          context: ctx,
          store,
          setModuleReducers: reducers => moduleStoreReducer.set(store, reducers),
        });

        await contentLoaded();
        renderApp(WrappedApp);
        logger.success('rendered');
      };

      await render(App);

      return render;
    },
  };
};
