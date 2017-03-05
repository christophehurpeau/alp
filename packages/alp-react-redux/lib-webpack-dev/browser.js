/* global window */
import render, { unmountComponentAtNode } from 'fody';
import Logger from 'nightingale-logger';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middleware-browser';
import { websocketMiddleware } from './websocket';
import loadingBar from './loading-bar';
import AlpReactApp from './AlpReactApp';
import AlpReduxApp from './AlpReduxApp';
import * as alpReducers from './reducers';

import t from 'flow-runtime';
export { AlpReactApp, AlpReduxApp };
export { Helmet } from 'fody';
export { combineReducers } from 'redux';
export { connect } from 'react-redux';
import _createPureStatelessComponent from 'react-pure-stateless-component';
export { _createPureStatelessComponent as createPureStatelessComponent };

export { createAction, createReducer, createLoader, classNames } from './utils';
export { createEmitAction, createEmitPromiseAction } from './websocket';

var HYDRATE_STATE = 'HYDRATE_STATE';
var logger = new Logger('alp:react-redux');

var store = void 0;
var currentModuleDescriptorIdentifier = void 0;

var createHydratableReducer = function createHydratableReducer(reducer) {
  var _reducerType = t.function();

  t.param('reducer', _reducerType).assert(reducer);
  return function (state, action) {
    if (action.type === HYDRATE_STATE) {
      state = action.state;
    }

    return reducer(state, action);
  };
};

var OptionsType = t.type('OptionsType', t.exactObject(t.property('sharedReducers', t.nullable(t.object()))));


export default function alpReactRedux(element) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$sharedReducers = _ref.sharedReducers,
      sharedReducers = _ref$sharedReducers === undefined ? {} : _ref$sharedReducers;

  if (arguments[1] !== undefined) {
    t.param('arguments[1]', OptionsType).assert(arguments[1]);
  }

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
        if (!moduleDescriptor.View) {
          throw new Error('View is undefined, class expected');
        }

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
              unmountComponentAtNode(element);
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

        render({
          App: reducer ? AlpReduxApp : AlpReactApp,
          appProps: {
            store: store,
            context: this,
            moduleDescriptor: moduleDescriptor
          },
          View: moduleDescriptor.View,
          props: moduleHasReducers ? undefined : data,
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