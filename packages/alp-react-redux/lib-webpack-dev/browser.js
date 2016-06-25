import DefaultApp from 'fody-app';
import ReduxApp from 'fody-redux-app';
import render from 'fody';
import Logger from 'nightingale-logger';
import { createStore } from 'redux';

import _createAction from './createAction';
export { _createAction as createAction };
import _createReducer from './createReducer';
export { _createReducer as createReducer };

export { connect } from 'react-redux';

var logger = new Logger('alp.react-redux');

var store = undefined;

export default function alpReactRedux(element) {
    return function (app) {
        app.context.render = function (moduleDescriptor, data) {
            logger.debug('render view', { data: data });

            if (!moduleDescriptor.View) {
                throw new Error('View is undefined, class expected');
            }

            var reducer = moduleDescriptor.reducer;

            if (store === undefined) {
                if (reducer) {
                    store = createStore(reducer, data, window.devToolsExtension && window.devToolsExtension());
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