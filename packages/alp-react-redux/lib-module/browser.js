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


export { AlpReactApp, AlpReduxApp };
import _Helmet from 'react-helmet';
export { _Helmet as Helmet };

export { combineReducers } from 'redux';
export { connect } from 'react-redux';
export { createAction, createReducer, createLoader, createPureStatelessComponent, classNames } from './utils';
export { createEmitAction, createEmitPromiseAction } from './websocket';

var HYDRATE_STATE = 'HYDRATE_STATE';
var logger = new Logger('alp:react-redux');

var store = void 0;
var currentModuleDescriptorIdentifier = void 0;

var renderApp = function renderApp(_ref) {
  var App = _ref.App,
      appProps = _ref.appProps,
      View = _ref.View,
      props = _ref.props,
      element = _ref.element;

  var app = React.createElement(
    App,
    appProps,
    React.createElement(View, props)
  );
  return render(app, element);
};

var createHydratableReducer = function createHydratableReducer(reducer) {
  return function (state, action) {
    if (action.type === HYDRATE_STATE) {
      state = action.state;
    }

    return reducer(state, action);
  };
};

var getReactAppElement = function getReactAppElement() {
  return document.getElementById('react-app');
};

export default function alpReactRedux() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      appHOC = _ref2.appHOC,
      _ref2$sharedReducers = _ref2.sharedReducers,
      sharedReducers = _ref2$sharedReducers === undefined ? {} : _ref2$sharedReducers;

  var AlpReactAppLayout = appHOC ? appHOC(AlpReactApp) : AlpReactApp;
  var AlpReduxAppLayout = appHOC ? appHOC(AlpReduxApp) : AlpReduxApp;

  return function (app) {
    var middleware = [createFunctionMiddleware(app), promiseMiddleware];

    if (app.websocket) {
      var loggerWebsocket = logger.child('websocket');
      loggerWebsocket.debug('register websocket redux:action');
      app.websocket.on('redux:action', function (action) {
        loggerWebsocket.debug('dispatch action from websocket', action);
        if (store) {
          store.dispatch(action);
        }
      });
      middleware.push(websocketMiddleware(app));
    }

    app.context.render = function (moduleDescriptor, data, _loaded, _loadingBar) {
      var _this = this;

      if (!_loadingBar) _loadingBar = loadingBar();
      logger.debug('render view', { data: data });

      try {

        if (!_loaded && moduleDescriptor.loader) {
          var currentState = store && currentModuleDescriptorIdentifier === moduleDescriptor.identifier ? store.getState() : Object.create(null);

          // const _state = data;
          return moduleDescriptor.loader(currentState, data).then(function (data) {
            return _this.render(moduleDescriptor, data, true, _loadingBar);
          });
        }

        var moduleHasReducers = !!(moduleDescriptor.reducer || moduleDescriptor.reducers);
        var reducer = moduleDescriptor.reducer ? moduleDescriptor.reducer : combineReducers(Object.assign({}, moduleDescriptor.reducers, alpReducers, sharedReducers));

        if (!reducer) {
          if (store) {
            reducer = function reducer() {};
            store.dispatch({ type: HYDRATE_STATE, state: Object.create(null) });
          }
        } else if (store === undefined) {
          var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
          store = createStore(createHydratableReducer(reducer), Object.assign(Object.create(null), { context: this }, data), composeEnhancers(applyMiddleware.apply(undefined, middleware)));
        } else {
          var state = Object.create(null);
          var isSameModule = currentModuleDescriptorIdentifier === moduleDescriptor.identifier;

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
          store.dispatch({ type: HYDRATE_STATE, state: state });
        }

        currentModuleDescriptorIdentifier = moduleDescriptor.identifier;

        if (reducer) {
          this.store = store;
        }

        renderApp({
          element: getReactAppElement(),
          App: reducer ? AlpReduxAppLayout : AlpReactAppLayout,
          appProps: {
            store: store,
            context: this,
            moduleDescriptor: moduleDescriptor
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