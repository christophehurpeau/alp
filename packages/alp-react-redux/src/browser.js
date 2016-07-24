/* global window */
import render, { App as DefaultApp } from 'fody';
import ReduxApp from 'fody-redux-app';
import Logger from 'nightingale-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middlewares';
import { websocketMiddleware } from './websocket';

export { combineReducers } from 'redux';
export { connect } from 'react-redux';
export createAction from './createAction';
export createReducer from './createReducer';
export { createEmitAction, createEmitPromiseAction } from './websocket';

const logger = new Logger('alp.react-redux');

let store;

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

        app.context.render = function (moduleDescriptor, data) {
            logger.debug('render view', { data });

            if (!moduleDescriptor.View) {
                throw new Error('View is undefined, class expected');
            }

            const reducer = moduleDescriptor.reducer;

            if (store === undefined) {
                if (reducer) {
                    store = createStore(
                        reducer,
                        data,
                        compose(
                            applyMiddleware(...middlewares),
                            window.devToolsExtension ? window.devToolsExtension() : f => f
                        )
                    );
                }
            } else {
                // replace state
                const state = store.getState();
                Object.keys(state).forEach(key => delete state[key]);
                Object.assign(state, data);

                // replace reducer
                if (reducer) {
                    store.replaceReducer(reducer);
                } else {
                    store.replaceReducer((state, action) => state);
                }
            }

            if (reducer) {
                this.store = store;
            }

            render({
                context: this,
                View: moduleDescriptor.View,
                data,
                element,
                App: reducer ? ReduxApp : DefaultApp,
            });
        };
    };
}
