'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ibexReactRedux;

var _fodyApp = require('fody-app');

var _fodyApp2 = _interopRequireDefault(_fodyApp);

var _fodyReduxApp = require('fody-redux-app');

var _fodyReduxApp2 = _interopRequireDefault(_fodyReduxApp);

var _contentLoaded = require('content-loaded');

var _contentLoaded2 = _interopRequireDefault(_contentLoaded);

var _fody = require('fody');

var _fody2 = _interopRequireDefault(_fody);

var _nightingale = require('nightingale');

var _redux = require('redux');

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale.ConsoleLogger('alp.react-redux');

let store;

/**
 * @function
 * @param
*/function ibexReactRedux(_ref) {
    let moduleDescriptor = _ref.moduleDescriptor;
    let initialData = _ref.initialData;
    let element = _ref.element;

    return app => {
        app.context.render = /**
                              * @function
                              * @param moduleDescriptor
                              * @param data
                             */function (moduleDescriptor, data) {
            logger.debug('render view', { data: data });

            if (!moduleDescriptor.View) {
                throw new Error('View is undefined, class expected');
            }

            const reducer = moduleDescriptor.reducer;

            if (store === undefined) {
                if (reducer) {
                    store = (0, _redux.createStore)(reducer, data);
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

            (0, _fody2.default)({
                context: this,
                View: moduleDescriptor.View,
                data: data,
                element: element,
                App: reducer ? _fodyReduxApp2.default : _fodyApp2.default
            });
        };

        if (moduleDescriptor) {
            const context = Object.create(app.context);
            (0, _contentLoaded2.default)().then(() => {
                logger.debug('document ready');
                context.render(moduleDescriptor, initialData);
            });
        }
    };
}
//# sourceMappingURL=browser.js.map