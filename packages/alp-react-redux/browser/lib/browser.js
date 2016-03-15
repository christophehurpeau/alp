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

var logger = new _nightingale.ConsoleLogger('alp.react-redux');

var store = void 0;

/**
 * @function
 * @param
*/function ibexReactRedux(_ref) {
    var moduleDescriptor = _ref.moduleDescriptor;
    var initialData = _ref.initialData;
    var element = _ref.element;

    return function (app) {
        app.context.render = /**
                              * @function
                              * @param moduleDescriptor
                              * @param data
                             */function (moduleDescriptor, data) {
            logger.debug('render view', { data: data });

            if (!moduleDescriptor.View) {
                throw new Error('View is undefined, class expected');
            }

            var reducer = moduleDescriptor.reducer;

            if (store === undefined) {
                if (reducer) {
                    store = (0, _redux.createStore)(reducer, data);
                }
            } else {
                ( /**
                   * @function
                  */function () {
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

            (0, _fody2.default)({
                context: this,
                View: moduleDescriptor.View,
                data: data,
                element: element,
                App: reducer ? _fodyReduxApp2.default : _fodyApp2.default
            });
        };

        if (moduleDescriptor) {
            ( /**
               * @function
              */function () {
                var context = Object.create(app.context);
                (0, _contentLoaded2.default)().then(function () {
                    logger.debug('document ready');
                    context.render(moduleDescriptor, initialData);
                });
            })();
        }
    };
}
//# sourceMappingURL=browser.js.map