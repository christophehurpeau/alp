/* global window */
import render from 'fody/src';
import Logger from 'nightingale-logger/src';
import { createStore, applyMiddleware, compose } from 'redux/src';
import { promiseMiddleware, createFunctionMiddleware } from './middlewares-browser';
import { websocketMiddleware } from './websocket';
import loadingBar from './loading-bar';
import AlpReactApp from './AlpReactApp';
import AlpReduxApp from './AlpReduxApp';

export { AlpReactApp, AlpReduxApp };
export { Helmet } from 'fody/src';
export { combineReducers } from 'redux/src';
export { connect } from 'react-redux/src';
export createPureStatelessComponent from 'react-pure-stateless-component';
export createAction from './utils/createAction';
export createReducer from './utils/createReducer';
export createLoader from './utils/createLoader';
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
      const loggerWebsocket = logger.child('websocket');
      loggerWebsocket.debug('register websocket redux:action');
      app.websocket.on('redux:action', action => {
        loggerWebsocket.debug('dispatch action from websocket', action);
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
            store.getState() : Object.create(null);

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
          } else {
            // replace reducer
            store.replaceReducer(reducer);
          }

          Object.assign(state, data);
          store.dispatch({ type: HYDRATE_STATE, state });
        }

        currentModuleDescriptorIdentifier = moduleDescriptor.identifier;
        this.store = store;

        render({
          App: reducer ? AlpReduxApp : AlpReactApp,
          appProps: {
            store,
            context: this,
            moduleDescriptor,
          },
          View: moduleDescriptor.View,
          props: data,
          element,
        });
      } catch (err) {
        _loadingBar();
        throw err;
      }

      _loadingBar();
    };
  };
}
