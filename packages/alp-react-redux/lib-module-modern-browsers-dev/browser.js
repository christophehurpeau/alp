function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import contentLoaded from 'content-loaded';
import React from 'react';
import { hydrate } from 'react-dom';
import Helmet from 'react-helmet';
import reactTreeWalker from 'react-tree-walker';
import Logger from 'nightingale-logger';
// eslint-disable-next-line import/no-extraneous-dependencies
import BrowserAppContainer from 'alp-dev/BrowserAppContainer';
import createAlpAppWrapper from './createAlpAppWrapper';
import createBrowserStore from './store/createBrowserStore';
import createBrowserModuleStoreReducer from './store/createBrowserModuleStoreReducer';
import createModuleVisitor from './module/createModuleVisitor';
import { ReduxActionType as _ReduxActionType } from './types';

import t from 'flow-runtime';
const ReduxActionType = t.tdz(function () {
  return _ReduxActionType;
});
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

const preRender = function () {
  var _ref = _asyncToGenerator(function* (ctx, appElement) {
    const moduleVisitor = createModuleVisitor();

    const PreRenderWrappedApp = createAlpAppWrapper(appElement, {
      context: ctx,
      store: { getState: function getState() {
          return { ctx };
        } }
    });
    yield reactTreeWalker(React.createElement(PreRenderWrappedApp), moduleVisitor.visitor);

    return moduleVisitor.getReducers();
  });

  return function preRender() {
    return _ref.apply(this, arguments);
  };
}();

export default (function browser(app) {
  app.reduxReducers = {
    loading: function loading(state = 0, action) {
      let _stateType = t.nullable(t.number());

      let _actionType = t.ref(ReduxActionType);

      t.param('state', _stateType).assert(state);
      t.param('action', _actionType).assert(action);

      if (action.meta && action.meta.loading !== undefined) {
        return state + (action.meta.loading ? 1 : -1);
      }
      return state;
    }
  };
  app.reduxMiddlewares = [];

  return {
    renderApp: function () {
      var _ref2 = _asyncToGenerator(function* (App, { middlewares = [], sharedReducers } = {}) {
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

        const render = function () {
          var _ref3 = _asyncToGenerator(function* (App) {
            let appElement = React.createElement(App);

            appElement = React.createElement(BrowserAppContainer, {}, appElement);


            const moduleReducers = yield preRender(ctx, appElement);

            store = createStore(ctx, moduleReducers);


            const WrappedApp = createAlpAppWrapper(appElement, {
              context: ctx,
              store,
              setModuleReducers: function setModuleReducers(reducers) {
                return moduleStoreReducer.set(store, reducers);
              }
            });

            yield contentLoaded();
            _renderApp(WrappedApp);
            logger.success('rendered');
          });

          return function render() {
            return _ref3.apply(this, arguments);
          };
        }();

        yield render(App);

        return render;
      });

      return function renderApp() {
        return _ref2.apply(this, arguments);
      };
    }()
  };
});
//# sourceMappingURL=browser.js.map