'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createEmitPromiseAction = exports.createEmitAction = exports.createLoader = exports.createReducer = exports.createAction = exports.createPureStatelessComponent = exports.connect = exports.combineReducers = undefined;

var _redux = require('redux');

Object.defineProperty(exports, 'combineReducers', {
    enumerable: true,
    get: function get() {
        return _redux.combineReducers;
    }
});

var _reactRedux = require('react-redux');

Object.defineProperty(exports, 'connect', {
    enumerable: true,
    get: function get() {
        return _reactRedux.connect;
    }
});

var _websocket = require('./websocket');

Object.defineProperty(exports, 'createEmitAction', {
    enumerable: true,
    get: function get() {
        return _websocket.createEmitAction;
    }
});
Object.defineProperty(exports, 'createEmitPromiseAction', {
    enumerable: true,
    get: function get() {
        return _websocket.createEmitPromiseAction;
    }
});
exports.default = alpReactRedux;

var _fody = require('fody');

var _fody2 = _interopRequireDefault(_fody);

var _fodyReduxApp = require('fody-redux-app');

var _fodyReduxApp2 = _interopRequireDefault(_fodyReduxApp);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _middlewares = require('./middlewares');

var _reactPureStatelessComponent = require('react-pure-stateless-component');

var _reactPureStatelessComponent2 = _interopRequireDefault(_reactPureStatelessComponent);

var _createAction2 = require('./createAction');

var _createAction3 = _interopRequireDefault(_createAction2);

var _createReducer2 = require('./createReducer');

var _createReducer3 = _interopRequireDefault(_createReducer2);

var _createLoader2 = require('./createLoader');

var _createLoader3 = _interopRequireDefault(_createLoader2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createPureStatelessComponent = _reactPureStatelessComponent2.default;
exports.createAction = _createAction3.default;
exports.createReducer = _createReducer3.default;
exports.createLoader = _createLoader3.default;


const logger = new _nightingaleLogger2.default('alp.react-redux');

let store;
let currentModuleDescriptorIdentifier;

function alpReactRedux(element) {
    return app => {
        const middlewares = [(0, _middlewares.createFunctionMiddleware)(app), _middlewares.promiseMiddleware];
        if (app.websocket) {
            logger.debug('register websocket redux:action');
            app.websocket.on('redux:action', action => {
                logger.info('dispatch action from websocket', action);
                if (store) {
                    store.dispatch(action);
                }
            });
            middlewares.push((0, _websocket.websocketMiddleware)(app));
        }

        app.context.render = function (moduleDescriptor, data, _loaded) {
            logger.debug('render view', { data });

            if (!moduleDescriptor.View) {
                throw new Error('View is undefined, class expected');
            }

            if (!_loaded && moduleDescriptor.loader) {
                const currentState = store && currentModuleDescriptorIdentifier === moduleDescriptor.identifier ? store.getState() : undefined;

                // const _state = data;
                return moduleDescriptor.loader(currentState, data).then(data => {
                    return this.render(moduleDescriptor, data, true);
                });
            }

            const reducer = moduleDescriptor.reducer;

            if (!reducer) {
                store = undefined;
            } else if (store === undefined) {
                store = (0, _redux.createStore)(reducer, data, (0, _redux.compose)((0, _redux.applyMiddleware)(...middlewares), window.devToolsExtension ? window.devToolsExtension() : f => {
                    return f;
                }));
            } else {
                const state = store.getState();

                if (currentModuleDescriptorIdentifier !== moduleDescriptor.identifier) {
                    // replace state
                    Object.keys(state).forEach(key => {
                        return delete state[key];
                    });
                }

                Object.assign(state, data);

                if (currentModuleDescriptorIdentifier !== moduleDescriptor.identifier) {
                    // replace reducer
                    if (reducer) {
                        store.replaceReducer(reducer);
                    } else {
                        store.replaceReducer((state, action) => {
                            return state;
                        });
                    }
                }
            }

            currentModuleDescriptorIdentifier = moduleDescriptor.identifier;
            this.store = store;

            (0, _fody2.default)({
                context: this,
                View: moduleDescriptor.View,
                data: data,
                element,
                App: reducer ? _fodyReduxApp2.default : _fody.App
            });
        };
    };
}
//# sourceMappingURL=browser.js.map