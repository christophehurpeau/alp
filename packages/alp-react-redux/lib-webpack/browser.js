var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* global window, PRODUCTION */
import render, { App as DefaultApp } from 'fody';
import ReduxApp from 'fody-redux-app';
import Logger from 'nightingale-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middlewares-browser';
import { websocketMiddleware } from './websocket';
import loadingBar from './loading-bar';

export { combineReducers } from 'redux';
export { connect } from 'react-redux';
import _createPureStatelessComponent from 'react-pure-stateless-component';
export { _createPureStatelessComponent as createPureStatelessComponent };
import _createAction from './createAction';
export { _createAction as createAction };
import _createReducer from './createReducer';
export { _createReducer as createReducer };
import _createLoader from './createLoader';
export { _createLoader as createLoader };

export { createEmitAction, createEmitPromiseAction } from './websocket';

var HYDRATE_STATE = 'HYDRATE_STATE';
var logger = new Logger('alp.react-redux');

var store = undefined;
var currentModuleDescriptorIdentifier = undefined;

export default function alpReactRedux(element) {
  return function (app) {
    var middlewares = [createFunctionMiddleware(app), promiseMiddleware];
    if (app.websocket) {
      logger.debug('register websocket redux:action');
      app.websocket.on('redux:action', function (action) {
        logger.info('dispatch action from websocket', action);
        if (store) {
          store.dispatch(action);
        }
      });
      middlewares.push(websocketMiddleware(app));
    }

    app.context.render = function (moduleDescriptor, data, _loaded, _loadingBar) {
      var _this = this;

      if (!_loadingBar) _loadingBar = loadingBar();
      logger.debug('render view', { data: data });

      try {
        var _ret = function () {

          if (!_loaded && moduleDescriptor.loader) {
            var currentState = store && currentModuleDescriptorIdentifier === moduleDescriptor.identifier ? store.getState() : undefined;

            // const _state = data;
            return {
              v: moduleDescriptor.loader(currentState, data).then(function (data) {
                return _this.render(moduleDescriptor, data, true, _loadingBar);
              })
            };
          }

          var reducer = moduleDescriptor.reducer;

          if (!reducer) {
            if (store) {
              reducer = function reducer() {};
              store.dispatch({ type: HYDRATE_STATE, state: Object.create(null) });
            }
          } else if (store === undefined) {
            store = createStore(function (state, action) {
              if (action.type === HYDRATE_STATE) {
                state = action.state;
              }

              return reducer(state, action);
            }, data, compose(applyMiddleware.apply(undefined, middlewares), window.devToolsExtension ? window.devToolsExtension() : function (f) {
              return f;
            }));
          } else {
            var state = Object.create(null);

            if (store && currentModuleDescriptorIdentifier === moduleDescriptor.identifier) {
              // keep state
              Object.assign(state, store.getState());
            }

            Object.assign(state, data);
            store.dispatch({ type: HYDRATE_STATE, state: state });
          }

          currentModuleDescriptorIdentifier = moduleDescriptor.identifier;
          _this.store = store;

          render({
            context: _this,
            View: moduleDescriptor.View,
            data: data,
            element: element,
            App: reducer ? ReduxApp : DefaultApp
          });
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      } catch (err) {
        _loadingBar();
        throw err;
      }

      _loadingBar();
    };
  };
}
//# sourceMappingURL=browser.js.map