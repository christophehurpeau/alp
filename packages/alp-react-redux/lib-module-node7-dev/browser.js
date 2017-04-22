var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'browser.jsx',
    _this = this;

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import Logger from 'nightingale-logger';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middleware-browser';
import { websocketMiddleware } from './websocket';
import loadingBar from './loading-bar';
import AlpReactApp from './layout/AlpReactApp';
import AlpReduxApp from './layout/AlpReduxApp';
import * as alpReducers from './reducers';
import { ReactComponentType as _ReactComponentType } from './types';

import t from 'flow-runtime';
const ReactComponentType = t.tdz(() => _ReactComponentType);
export { AlpReactApp, AlpReduxApp };
import _Helmet from 'react-helmet';
export { _Helmet as Helmet };

export { combineReducers } from 'redux';
export { connect } from 'react-redux';
export { createAction, createReducer, createLoader, createPureStatelessComponent, classNames } from './utils';
export { createEmitAction, createEmitPromiseAction } from './websocket';

const HYDRATE_STATE = 'HYDRATE_STATE';
const logger = new Logger('alp:react-redux');

let store;
let currentModuleDescriptorIdentifier;

const AppOptionsType = t.type('AppOptionsType', t.exactObject(t.property('element', t.any()), t.property('App', t.ref(ReactComponentType)), t.property('appProps', t.object()), t.property('View', t.ref(ReactComponentType)), t.property('props', t.nullable(t.object()))));


const renderApp = _arg => {
  let { App, appProps, View, props, element } = AppOptionsType.assert(_arg);

  let app = React.createElement(
    App,
    _extends({}, appProps, {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 34
      }
    }),
    React.createElement(View, _extends({}, props, {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 34
      }
    }))
  );
  return render(app, element);
};

const createHydratableReducer = reducer => {
  let _reducerType = t.function();

  t.param('reducer', _reducerType).assert(reducer);
  return (state, action) => {
    if (action.type === HYDRATE_STATE) {
      state = action.state;
    }

    return reducer(state, action);
  };
};

const OptionsType = t.type('OptionsType', t.exactObject(t.property('appHOC', t.nullable(t.function())), t.property('sharedReducers', t.nullable(t.object()))));


const getReactAppElement = () => document.getElementById('react-app');

export default function alpReactRedux(_arg2 = {}) {
  let { appHOC, sharedReducers = {} } = t.nullable(OptionsType).assert(_arg2);

  const AlpReactAppLayout = appHOC ? appHOC(AlpReactApp) : AlpReactApp;
  const AlpReduxAppLayout = appHOC ? appHOC(AlpReduxApp) : AlpReduxApp;

  return app => {
    const middleware = [createFunctionMiddleware(app), promiseMiddleware];

    if (app.websocket) {
      const loggerWebsocket = logger.child('websocket');
      loggerWebsocket.debug('register websocket redux:action');
      app.websocket.on('redux:action', action => {
        loggerWebsocket.debug('dispatch action from websocket', action);
        if (store) {
          store.dispatch(action);
        }
      });
      middleware.push(websocketMiddleware(app));
    }

    app.context.render = function (moduleDescriptor, data, _loaded, _loadingBar) {
      if (!_loadingBar) _loadingBar = loadingBar();
      logger.debug('render view', { data });

      try {
        if (!moduleDescriptor.View) {
          throw new Error('View is undefined, class expected');
        }

        if (!_loaded && moduleDescriptor.loader) {
          const currentState = store && currentModuleDescriptorIdentifier === moduleDescriptor.identifier ? store.getState() : Object.create(null);

          // const _state = data;
          return moduleDescriptor.loader(currentState, data).then(data => this.render(moduleDescriptor, data, true, _loadingBar));
        }

        const moduleHasReducers = !!(moduleDescriptor.reducer || moduleDescriptor.reducers);
        let reducer = moduleDescriptor.reducer ? moduleDescriptor.reducer : combineReducers(Object.assign({}, moduleDescriptor.reducers, alpReducers, sharedReducers));

        if (!reducer) {
          if (store) {
            reducer = () => {};
            store.dispatch({ type: HYDRATE_STATE, state: Object.create(null) });
          }
        } else if (store === undefined) {
          const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
          store = createStore(createHydratableReducer(reducer), Object.assign(Object.create(null), { context: this }, data), composeEnhancers(applyMiddleware(...middleware)));
        } else {
          const state = Object.create(null);
          const isSameModule = currentModuleDescriptorIdentifier === moduleDescriptor.identifier;

          if (store) {
            if (isSameModule) {
              // keep state
              Object.assign(state, store.getState());
            } else {
              // destroy current component
              unmountComponentAtNode(getReactAppElement());
              // replace reducer
              store.replaceReducer(createHydratableReducer(reducer));
              // add initial context
              state.context = this;
            }
          }

          if (moduleHasReducers) Object.assign(state, data);
          store.dispatch({ type: HYDRATE_STATE, state });
        }

        currentModuleDescriptorIdentifier = moduleDescriptor.identifier;

        if (reducer) {
          this.store = store;
        }

        renderApp({
          element: getReactAppElement(),
          App: reducer ? AlpReduxAppLayout : AlpReactAppLayout,
          appProps: {
            store,
            context: this,
            moduleDescriptor
          },
          View: moduleDescriptor.View,
          props: moduleHasReducers ? undefined : data
        });
      } catch (err) {
        _loadingBar();
        throw err;
      }

      _loadingBar();
    };
  };
}
//# sourceMappingURL=browser.js.map