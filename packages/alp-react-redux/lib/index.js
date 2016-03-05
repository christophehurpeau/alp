'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = aukReactRedux;

var _fody = require('fody');

var _fody2 = _interopRequireDefault(_fody);

var _App = require('fody/lib/App');

var _App2 = _interopRequireDefault(_App);

var _fodyRedux = require('fody-redux');

var _fodyRedux2 = _interopRequireDefault(_fodyRedux);

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
    return app => {
        app.context.render = /**
                              * @function
                              * @param appDescriptor
                              * @param data
                             */function (appDescriptor, data) {
            if (appDescriptor.app) {
                this.store = (0, _redux.createStore)(appDescriptor.app, data);
            }

            this.body = (0, _fody2.default)({
                htmlData: {
                    context: this,
                    appDescriptor
                },
                context: this,
                View: appDescriptor.View,
                initialData: appDescriptor.app ? () => this.store.getState() : () => null,
                Html,
                App: appDescriptor.app ? _fodyRedux2.default : _App2.default
            });
        };
    };
}
//# sourceMappingURL=index.js.map