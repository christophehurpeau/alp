'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createReducer = exports.createAction = undefined;
exports.default = alpReactRedux;

var _fodyApp = require('fody-app');

var _fodyApp2 = _interopRequireDefault(_fodyApp);

var _fodyReduxApp = require('fody-redux-app');

var _fodyReduxApp2 = _interopRequireDefault(_fodyReduxApp);

var _fody = require('fody');

var _fody2 = _interopRequireDefault(_fody);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _redux = require('redux');

var _createAction2 = require('./createAction');

var _createAction3 = _interopRequireDefault(_createAction2);

var _createReducer2 = require('./createReducer');

var _createReducer3 = _interopRequireDefault(_createReducer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createAction = _createAction3.default;
exports.createReducer = _createReducer3.default;


const logger = new _nightingaleLogger2.default('alp.react-redux');

let store;

function alpReactRedux(element) {
    return app => {
        app.context.render = function (moduleDescriptor, data) {
            logger.debug('render view', { data });

            if (!moduleDescriptor.View) {
                throw new Error('View is undefined, class expected');
            }

            const reducer = moduleDescriptor.reducer;

            if (store === undefined) {
                if (reducer) {
                    store = (0, _redux.createStore)(reducer, data, window.devToolsExtension && window.devToolsExtension());
                }
            } else {
                // replace state
                const state = store.getState();
                Object.keys(state).forEach(key => {
                    return delete state[key];
                });
                Object.assign(state, data);

                // replace reducer
                if (reducer) {
                    store.replaceReducer(reducer);
                } else {
                    store.replaceReducer((state, action) => {
                        return state;
                    });
                }
            }

            if (reducer) {
                this.store = store;
            }

            (0, _fody2.default)({
                context: this,
                View: moduleDescriptor.View,
                data,
                element,
                App: reducer ? _fodyReduxApp2.default : _fodyApp2.default
            });
        };
    };
}
//# sourceMappingURL=browser.js.map