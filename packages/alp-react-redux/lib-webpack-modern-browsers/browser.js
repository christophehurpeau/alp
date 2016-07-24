/* global window */
import render, { App as DefaultApp } from 'fody';
import ReduxApp from 'fody-redux-app';
import Logger from 'nightingale-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middlewares';
import { websocketMiddleware } from './websocket';

export { connect, combineReducers } from 'react-redux';
import _createAction from './createAction';
export { _createAction as createAction };
import _createReducer from './createReducer';
export { _createReducer as createReducer };

export { createEmitAction, createEmitPromiseAction } from './websocket';

var logger = new Logger('alp.react-redux');

var store = undefined;

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

        app.context.render = function (moduleDescriptor, data) {
            logger.debug('render view', { data });

            if (!moduleDescriptor.View) {
                throw new Error('View is undefined, class expected');
            }

            var reducer = moduleDescriptor.reducer;

            if (store === undefined) {
                if (reducer) {
                    store = createStore(reducer, data, compose(applyMiddleware(...middlewares), window.devToolsExtension ? window.devToolsExtension() : f => f));
                }
            } else {
                (function () {
                    // replace state
                    var state = store.getState();
                    Object.keys(state).forEach(key => delete state[key]);
                    Object.assign(state, data);

                    // replace reducer
                    if (reducer) {
                        store.replaceReducer(reducer);
                    } else {
                        store.replaceReducer((state, action) => state);
                    }
                })();
            }

            if (reducer) {
                this.store = store;
            }

            render({
                context: this,
                View: moduleDescriptor.View,
                data,
                element,
                App: reducer ? ReduxApp : DefaultApp
            });
        };
    };
}
//# sourceMappingURL=browser.js.map