/* global window */
import render, { App as DefaultApp } from 'fody';
import ReduxApp from 'fody-redux-app';
import Logger from 'nightingale-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middlewares';
import { websocketMiddleware } from './websocket';

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

var logger = new Logger('alp.react-redux');

var store = undefined;
var currentModuleDescriptorIdentifier = undefined;

export default function alpReactRedux(element) {
  return app => {
    var middlewares = [createFunctionMiddleware(app), promiseMiddleware];
    if (app.websocket) {
      logger.debug('register websocket redux:action');
      app.websocket.on('redux:action', action => {
        logger.info('dispatch action from websocket', action);
        if (store) {
          store.dispatch(action);
        }
      });
      middlewares.push(websocketMiddleware(app));
    }

    app.context.render = function (moduleDescriptor, data, _loaded) {
      logger.debug('render view', { data });

      if (!moduleDescriptor.View) {
        throw new Error('View is undefined, class expected');
      }

      if (!_loaded && moduleDescriptor.loader) {
        var currentState = store && currentModuleDescriptorIdentifier === moduleDescriptor.identifier ? store.getState() : undefined;

        // const _state = data;
        return moduleDescriptor.loader(currentState, data).then(data => this.render(moduleDescriptor, data, true));
      }

      var reducer = moduleDescriptor.reducer;

      if (!reducer) {
        store = undefined;
      } else if (store === undefined) {
        store = createStore(reducer, data, compose(applyMiddleware(...middlewares), window.devToolsExtension ? window.devToolsExtension() : f => f));
      } else {
        (function () {
          var state = store.getState();

          if (currentModuleDescriptorIdentifier !== moduleDescriptor.identifier) {
            // replace state
            Object.keys(state).forEach(key => delete state[key]);
          }

          Object.assign(state, data);

          // replace reducer and dispatch init action
          store.replaceReducer(reducer);
        })();
      }

      currentModuleDescriptorIdentifier = moduleDescriptor.identifier;
      this.store = store;

      render({
        context: this,
        View: moduleDescriptor.View,
        data: data,
        element,
        App: reducer ? ReduxApp : DefaultApp
      });
    };
  };
}
//# sourceMappingURL=browser.js.map