import render, { App as DefaultApp } from 'fody';
import ReduxApp from 'fody-redux-app';
import Logger from 'nightingale-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { promiseMiddleware, createFunctionMiddleware } from './middlewares';
import { websocketMiddleware } from './websocket';

export { connect } from 'react-redux';
import _createAction from './createAction';
export { _createAction as createAction };
import _createReducer from './createReducer';
export { _createReducer as createReducer };

export { createEmitAction, createEmitPromiseAction } from './websocket';

var logger = new Logger('alp.react-redux');

var store = undefined;

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

        app.context.render = function (moduleDescriptor, data) {
            logger.debug('render view', { data: data });

            if (!moduleDescriptor.View) {
                throw new Error('View is undefined, class expected');
            }

            var reducer = moduleDescriptor.reducer;

            if (store === undefined) {
                if (reducer) {
                    store = createStore(reducer, data, compose(applyMiddleware.apply(undefined, middlewares), window.devToolsExtension ? window.devToolsExtension() : function (f) {
                        return f;
                    }));
                }
            } else {
                (function () {
                    // replace state
                    var state = store.getState();
                    Object.keys(state).forEach(function (key) {
                        return delete state[key];
                    });
                    Object.assign(state, data);

                    // replace reducer
                    if (reducer) {
                        store.replaceReducer(reducer);
                    } else {
                        store.replaceReducer(function (state, action) {
                            return state;
                        });
                    }
                })();
            }

            if (reducer) {
                this.store = store;
            }

            render({
                context: this,
                View: moduleDescriptor.View,
                data: data,
                element: element,
                App: reducer ? ReduxApp : DefaultApp
            });
        };
    };
}
//# sourceMappingURL=browser.js.map