import render from 'fody';
import DefaultApp from 'fody-app';
import ReduxApp from 'fody-redux-app';
import Logger from 'nightingale-logger';
import { createStore } from 'redux';

export createAction from './createAction';
export createReducer from './createReducer';

const logger = new Logger('alp.react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
const agents = [
    { name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 13 },
    { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 45 },
    { name: 'Chrome', regexp: /chrome\/([\d]+)/i, modernMinVersion: 41 }, // also works for opera.
    { name: 'Chromium', regexp: /chromium\/([\d]+)/i, modernMinVersion: 41 },
    // { name: 'Safari', regexp: /safari.*version\/([\d\w\.\-]+)/i, modernMinVersion: 10 },
];

export default function alpReactRedux(Html) {
    return (app) => {
        app.context.render = function (moduleDescriptor, data) {
            logger.debug('render view', { data });

            if (moduleDescriptor.reducer) {
                this.store = createStore(moduleDescriptor.reducer, data);
            }

            this.body = render({
                htmlData: {
                    context: this,
                    moduleDescriptor,
                    get scriptName() {
                        // TODO create alp-useragent with getter in context
                        const ua = this.context.req.headers['user-agent'];

                        for (let agent of agents) {
                            const res = agent.regexp.exec(ua);
                            if (res && res[1] >= agent.modernMinVersion) {
                                return 'modern-browsers';
                            }
                        }
                        return 'es5';
                    },
                    initialContextState: this.computeInitialStateForBrowser(),
                },
                context: this,
                View: moduleDescriptor.View,
                data: moduleDescriptor.reducer ? undefined : data,
                initialData: moduleDescriptor.reducer ? () => this.store.getState() : () => null,
                Html,
                App: moduleDescriptor.reducer ? ReduxApp : DefaultApp,
            });
        };
    };
}
