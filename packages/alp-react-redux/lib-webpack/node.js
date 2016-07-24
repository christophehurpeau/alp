import render, { App as DefaultApp } from 'fody';
import ReduxApp from 'fody-redux-app';
import Logger from 'nightingale-logger';
import { createStore } from 'redux';

import _createAction from './createAction';
export { _createAction as createAction };
import _createReducer from './createReducer';
export { _createReducer as createReducer };

export { combineReducers } from 'redux';
export { connect } from 'react-redux';

var logger = new Logger('alp.react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
var agents = [{ name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 14 }, { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 47 }, { name: 'Chrome', regexp: /chrome\/([\d]+)/i, modernMinVersion: 51 }, // also works for opera.
{ name: 'Chromium', regexp: /chromium\/([\d]+)/i, modernMinVersion: 38 }, { name: 'Safari', regexp: /safari.*version\/([\d\w\.\-]+)/i, modernMinVersion: 10 }];

export default function alpReactRedux(Html) {
    return function (app) {
        app.context.render = function (moduleDescriptor, data) {
            var _this = this;

            logger.debug('render view', { data: data });

            if (moduleDescriptor.reducer) {
                this.store = createStore(moduleDescriptor.reducer, data);
            }

            this.body = render({
                htmlData: {
                    context: this,
                    moduleDescriptor: moduleDescriptor,
                    get scriptName() {
                        // TODO create alp-useragent with getter in context
                        var ua = this.context.req.headers['user-agent'];

                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = agents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var agent = _step.value;

                                var res = agent.regexp.exec(ua);
                                if (res && res[1] >= agent.modernMinVersion) {
                                    return 'modern-browsers';
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        return 'es5';
                    },
                    initialContextState: this.computeInitialStateForBrowser()
                },
                context: this,
                View: moduleDescriptor.View,
                data: moduleDescriptor.reducer ? undefined : data,
                initialData: moduleDescriptor.reducer ? function () {
                    return _this.store.getState();
                } : function () {
                    return null;
                },
                Html: Html,
                App: moduleDescriptor.reducer ? ReduxApp : DefaultApp
            });
        };
    };
}

export function emitAction(to, action) {
    to.emit('redux:action', action);
}
//# sourceMappingURL=node.js.map