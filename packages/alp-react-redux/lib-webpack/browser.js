/* global window */
import render, { unmountComponentAtNode } from 'fody';
import Logger from 'nightingale-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middleware-browser';
import { websocketMiddleware } from './websocket';
import loadingBar from './loading-bar';
import AlpReactApp from './AlpReactApp';
import AlpReduxApp from './AlpReduxApp';

export { AlpReactApp, AlpReduxApp };
export { Helmet } from 'fody';
export { combineReducers } from 'redux';
export { connect } from 'react-redux';
import _createPureStatelessComponent from 'react-pure-stateless-component';
export { _createPureStatelessComponent as createPureStatelessComponent };
import _createAction from './utils/createAction';
export { _createAction as createAction };
import _createReducer from './utils/createReducer';
export { _createReducer as createReducer };
import _createLoader from './utils/createLoader';
export { _createLoader as createLoader };

export { createEmitAction, createEmitPromiseAction } from './websocket';

var HYDRATE_STATE = 'HYDRATE_STATE';
var logger = new Logger('alp:react-redux');

var store = void 0;
var currentModuleDescriptorIdentifier = void 0;

var createHydratableReducer = function createHydratableReducer(reducer) {
  return function (state, action) {
    if (action.type === HYDRATE_STATE) {
      state = action.state;
    }

    return reducer(state, action);
  };
};

export default function alpReactRedux(element) {
  return function (app) {
    var middleware = [createFunctionMiddleware(app), promiseMiddleware];

    if (app.websocket) {
      (function () {
        var loggerWebsocket = logger.child('websocket');
        loggerWebsocket.debug('register websocket redux:action');
        app.websocket.on('redux:action', function (action) {
          loggerWebsocket.debug('dispatch action from websocket', action);
          if (store) {
            store.dispatch(action);
          }
        });
        middleware.push(websocketMiddleware(app));
      })();
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

        var reducer = moduleDescriptor.reducer;

        if (!reducer) {
          if (store) {
            reducer = function reducer() {};
            store.dispatch({ type: HYDRATE_STATE, state: Object.create(null) });
          }
        } else if (store === undefined) {
          var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
          store = createStore(createHydratableReducer(reducer), data, composeEnhancers(applyMiddleware.apply(undefined, middleware)));
        } else {
          var state = Object.create(null);
          var isSameModule = currentModuleDescriptorIdentifier === moduleDescriptor.identifier;

          if (store) {
            if (isSameModule) {
              // keep state
              Object.assign(state, store.getState());
            } else {
              // destroy current component
              unmountComponentAtNode(element);
              // replace reducer
              store.replaceReducer(createHydratableReducer(reducer));
            }
          }

          Object.assign(state, data);
          store.dispatch({ type: HYDRATE_STATE, state: state });
        }

        currentModuleDescriptorIdentifier = moduleDescriptor.identifier;

        if (reducer) {
          this.store = store;
        }

        render({
          App: reducer ? AlpReduxApp : AlpReactApp,
          appProps: {
            store: store,
            context: this,
            moduleDescriptor: moduleDescriptor
          },
          View: moduleDescriptor.View,
          props: data,
          element: element
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