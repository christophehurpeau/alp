/* global window */
import render, { App as DefaultApp } from 'fody';
import ReduxApp from 'fody-redux-app';
import Logger from 'nightingale-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middlewares';
import { websocketMiddleware } from './websocket';

export { combineReducers } from 'redux';
export { connect } from 'react-redux';
export createPureStatelessComponent from 'react-pure-stateless-component';
export createAction from './createAction';
export createReducer from './createReducer';
export createLoader from './createLoader';
export { createEmitAction, createEmitPromiseAction } from './websocket';

const logger = new Logger('alp.react-redux');

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

        app.context.render = function (moduleDescriptor, data, _loaded) {
            logger.debug('render view', { data });

            if (!moduleDescriptor.View) {
                throw new Error('View is undefined, class expected');
            }

            if (!_loaded && moduleDescriptor.loader) {
                const currentState = store &&
                                     currentModuleDescriptorIdentifier === moduleDescriptor.identifier ?
                                     store.getState() : undefined;

                // const _state = data;
                return moduleDescriptor.loader(currentState, data).then(data => (
                    this.render(moduleDescriptor, data, true)
                ));
            }

            const reducer = moduleDescriptor.reducer;

            if (!reducer) {
                store = undefined;
            } else if (store === undefined) {
                store = createStore(
                    reducer,
                    data,
                    compose(
                        applyMiddleware(...middlewares),
                        window.devToolsExtension ? window.devToolsExtension() : f => f
                    )
                );
            } else {
                const state = store.getState();

                if (currentModuleDescriptorIdentifier !== moduleDescriptor.identifier) {
                    // replace state
                    Object.keys(state).forEach(key => delete state[key]);
                }

                Object.assign(state, data);

                if (currentModuleDescriptorIdentifier !== moduleDescriptor.identifier) {
                    // replace reducer
                    if (reducer) {
                        store.replaceReducer(reducer);
                    } else {
                        store.replaceReducer((state, action) => state);
                    }
                }
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
        };
    };
}
