/* global window, PRODUCTION */
import render, { App as DefaultApp } from 'fody';
import ReduxApp from 'fody-redux-app';
import Logger from 'nightingale-logger/src';
import { createStore, applyMiddleware, compose } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middlewares-browser';
import { websocketMiddleware } from './websocket';
import loadingBar from './loading-bar';

export { combineReducers } from 'redux';
export { connect } from 'react-redux';
export createPureStatelessComponent from 'react-pure-stateless-component';
export createAction from './createAction';
export createReducer from './createReducer';
export createLoader from './createLoader';
export { createEmitAction, createEmitPromiseAction } from './websocket';

const HYDRATE_STATE = 'HYDRATE_STATE';
const logger = new Logger('alp:react-redux');

let store;
let currentModuleDescriptorIdentifier;

export default function alpReactRedux(element) {
  return (app) => {
    const middlewares = [
      createFunctionMiddleware(app),
      promiseMiddleware,
    ];
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

    app.context.render = function (moduleDescriptor, data, _loaded, _loadingBar) {
      if (!_loadingBar) _loadingBar = loadingBar();
      logger.debug('render view', { data });

      try {
        if (!PRODUCTION && !moduleDescriptor.View) {
          throw new Error('View is undefined, class expected');
        }

        if (!_loaded && moduleDescriptor.loader) {
          const currentState = store &&
          currentModuleDescriptorIdentifier === moduleDescriptor.identifier ?
            store.getState() : undefined;

          // const _state = data;
          return moduleDescriptor.loader(currentState, data).then(data => (
            this.render(moduleDescriptor, data, true, _loadingBar)
          ));
        }

        let reducer = moduleDescriptor.reducer;

        if (!reducer) {
          if (store) {
            reducer = () => {};
            store.dispatch({ type: HYDRATE_STATE, state: Object.create(null) });
          }
        } else if (store === undefined) {
          store = createStore(
            (state, action) => {
              if (action.type === HYDRATE_STATE) {
                state = action.state;
              }

              return reducer(state, action);
            },
            data,
            compose(
              applyMiddleware(...middlewares),
              window.devToolsExtension ? window.devToolsExtension() : f => f,
            ),
          );
        } else {
          const state = Object.create(null);

          if (store && currentModuleDescriptorIdentifier === moduleDescriptor.identifier) {
            // keep state
            Object.assign(state, store.getState());
          }

          Object.assign(state, data);
          store.dispatch({ type: HYDRATE_STATE, state });
        }

        currentModuleDescriptorIdentifier = moduleDescriptor.identifier;
        this.store = store;

        render({
          context: this,
          View: moduleDescriptor.View,
          data: data,
          element,
          App: reducer ? ReduxApp : DefaultApp,
        });
      } catch (err) {
        _loadingBar();
        throw err;
      }

      _loadingBar();
    };
  };
}
