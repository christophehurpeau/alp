import { render, unmountComponentAtNode } from 'react-dom';
import Logger from 'nightingale-logger/src';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux/src';
import { promiseMiddleware, createFunctionMiddleware } from './middleware-browser';
import { websocketMiddleware } from './websocket';
import loadingBar from './loading-bar';
import AlpReactApp from './layout/AlpReactApp';
import AlpReduxApp from './layout/AlpReduxApp';
import * as alpReducers from './reducers';
import type { ReactComponentType } from './types';

export { AlpReactApp, AlpReduxApp };
export Helmet from 'react-helmet';
export { combineReducers } from 'redux/src';
export { connect } from 'react-redux/src';
export { createAction, createReducer, createLoader, createPureStatelessComponent, classNames } from './utils';
export { createEmitAction, createEmitPromiseAction } from './websocket';

const HYDRATE_STATE = 'HYDRATE_STATE';
const logger = new Logger('alp:react-redux');

let store;
let currentModuleDescriptorIdentifier;

type AppOptionsType = {|
  element: any,
  App: ReactComponentType,
  appProps: Object,
  View: ReactComponentType,
  props: ?Object,
|};

const renderApp = ({ App, appProps, View, props, element }: AppOptionsType) => {
  let app = <App {...appProps}><View {...props} /></App>;
  return render(app, element);
};

const createHydratableReducer = (reducer: Function) => (
  (state, action) => {
    if (action.type === HYDRATE_STATE) {
      state = action.state;
    }

    return reducer(state, action);
  }
);

type OptionsType = {|
  appHOC: ?Function,
  sharedReducers: ?Object,
|};

const getReactAppElement = () => document.getElementById('react-app');

export default function alpReactRedux({ appHOC, sharedReducers = {} }: ?OptionsType = {}) {
  const AlpReactAppLayout = appHOC ? appHOC(AlpReactApp) : AlpReactApp;
  const AlpReduxAppLayout = appHOC ? appHOC(AlpReduxApp) : AlpReduxApp;

  return (app) => {
    const middleware = [
      createFunctionMiddleware(app),
      promiseMiddleware,
    ];

    if (app.websocket) {
      const loggerWebsocket = logger.child('websocket');
      loggerWebsocket.debug('register websocket redux:action');
      app.websocket.on('redux:action', (action) => {
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

        const moduleHasReducers = !!(moduleDescriptor.reducer || moduleDescriptor.reducers);
        let reducer = moduleDescriptor.reducer ?
          moduleDescriptor.reducer : (
            combineReducers({ ...moduleDescriptor.reducers, ...alpReducers, ...sharedReducers })
          );

        if (!reducer) {
          if (store) {
            reducer = () => {};
            store.dispatch({ type: HYDRATE_STATE, state: Object.create(null) });
          }
        } else if (store === undefined) {
          const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
          store = createStore(
            createHydratableReducer(reducer),
            Object.assign(Object.create(null), { context: this }, data),
            composeEnhancers(applyMiddleware(...middleware)),
          );
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
            moduleDescriptor,
          },
          View: moduleDescriptor.View,
          props: moduleHasReducers ? undefined : data,
        });
      } catch (err) {
        _loadingBar();
        throw err;
      }

      _loadingBar();
    };
  };
}
