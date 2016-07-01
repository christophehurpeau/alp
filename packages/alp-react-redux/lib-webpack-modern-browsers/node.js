import render from 'fody';
import DefaultApp from 'fody-app';
import ReduxApp from 'fody-redux-app';
import Logger from 'nightingale-logger';
import { createStore } from 'redux';

import _createAction from './createAction';
export { _createAction as createAction };
import _createReducer from './createReducer';
export { _createReducer as createReducer };

export { connect } from 'react-redux';

var logger = new Logger('alp.react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
var agents = [{ name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 14 }, { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 47 }, { name: 'Chrome', regexp: /chrome\/([\d]+)/i, modernMinVersion: 51 }, // also works for opera.
{ name: 'Chromium', regexp: /chromium\/([\d]+)/i, modernMinVersion: 38 }, { name: 'Safari', regexp: /safari.*version\/([\d\w\.\-]+)/i, modernMinVersion: 10 }];

export default function alpReactRedux(Html) {
    return app => {
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
                        var ua = this.context.req.headers['user-agent'];

                        for (var agent of agents) {
                            var res = agent.regexp.exec(ua);
                            if (res && res[1] >= agent.modernMinVersion) {
                                return 'modern-browsers';
                            }
                        }
                        return 'es5';
                    },
                    initialContextState: this.computeInitialStateForBrowser()
                },
                context: this,
                View: moduleDescriptor.View,
                data: moduleDescriptor.reducer ? undefined : data,
                initialData: moduleDescriptor.reducer ? () => this.store.getState() : () => null,
                Html,
                App: moduleDescriptor.reducer ? ReduxApp : DefaultApp
            });
        };
    };
}

export function emitAction(to, action) {
    to.emit('redux:action', action);
}
//# sourceMappingURL=node.js.map