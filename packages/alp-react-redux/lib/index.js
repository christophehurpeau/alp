'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = aukReactRedux;

var _fody = require('fody');

var _fody2 = _interopRequireDefault(_fody);

var _fodyRedux = require('fody-redux');

var _fodyRedux2 = _interopRequireDefault(_fodyRedux);

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function aukReactRedux(Html) {
    return app => {
        app.context.render = function (Component, reducers, data) {
            this.store = (0, _redux.createStore)(reducers, data);
            this.body = (0, _fody2.default)({
                context: this,
                Component,
                initialData: () => this.store.getState(),
                Html,
                App: _fodyRedux2.default
            });
        };
    };
}
//# sourceMappingURL=index.js.map