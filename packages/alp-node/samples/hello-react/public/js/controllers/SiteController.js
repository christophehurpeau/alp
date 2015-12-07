'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _alp = require('alp');

var _viewsIndexView = require('../views/IndexView');

var _viewsIndexView2 = _interopRequireDefault(_viewsIndexView);

exports.default = (0, _alp.newController)({
    index(ctx) {
        const name = ctx.params.string('name').notEmpty().value;
        return ctx.render(_viewsIndexView2.default, { name });
    }
});
module.exports = exports.default;
//# sourceMappingURL=siteController.js.map
