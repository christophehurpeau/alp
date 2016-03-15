'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = aukReactRedux;

var _fody = require('fody');

var _fody2 = _interopRequireDefault(_fody);

var _fodyApp = require('fody-app');

var _fodyApp2 = _interopRequireDefault(_fodyApp);

var _fodyReduxApp = require('fody-redux-app');

var _fodyReduxApp2 = _interopRequireDefault(_fodyReduxApp);

var _redux = require('redux');

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function
 * @param Html
*/function aukReactRedux(Html) {
    return function (app) {
        app.context.render = /**
                              * @function
                              * @param moduleDescriptor
                              * @param data
                             */function (moduleDescriptor, data) {
            var _this = this;

            if (moduleDescriptor.reducer) {
                this.store = (0, _redux.createStore)(moduleDescriptor.reducer, data);
            }

            this.body = (0, _fody2.default)({
                htmlData: {
                    context: this,
                    moduleDescriptor: moduleDescriptor
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
                App: moduleDescriptor.reducer ? _fodyReduxApp2.default : _fodyApp2.default
            });
        };
    };
}
//# sourceMappingURL=node.js.map