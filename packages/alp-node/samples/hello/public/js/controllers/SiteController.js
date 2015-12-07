'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _alp = require('alp');

var _viewsTuracoView = require('../views/TuracoView');

var _viewsTuracoView2 = _interopRequireDefault(_viewsTuracoView);

exports['default'] = (0, _alp.newController)({
    index: function index(ctx) {
        var name = ctx.params.string('name').notEmpty().value;
        ctx.body = ctx.t('Hello %s!', ctx.params.isValid() ? name : 'World');
    },

    turaco: function turaco(ctx) {
        var name = ctx.params.string('name').notEmpty().value;
        return ctx.render(_viewsTuracoView2['default'], null, { name: name });
    }
});
module.exports = exports['default'];
//# sourceMappingURL=siteController.js.map
