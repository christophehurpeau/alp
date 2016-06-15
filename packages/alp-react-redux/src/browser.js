import DefaultApp from 'fody-app';
import ReduxApp from 'fody-redux-app';
import render from 'fody';
import Logger from 'nightingale-logger';
import { createStore } from 'redux';

export createAction from './createAction';
export createReducer from './createReducer';

const logger = new Logger('alp.react-redux');

let store;

export default function alpReactRedux(element) {
    return (app) => {
        app.context.render = function (moduleDescriptor, data) {
            logger.debug('render view', { data });

            if (!moduleDescriptor.View) {
                throw new Error('View is undefined, class expected');
            }

            const reducer = moduleDescriptor.reducer;

            if (store === undefined) {
                if (reducer) {
                    store = createStore(reducer, data);
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
