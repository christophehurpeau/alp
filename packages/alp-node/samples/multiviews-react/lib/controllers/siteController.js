'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _alp = require('alp');

var _View1View = require('../views/View1View');

var _View1View2 = _interopRequireDefault(_View1View);

var _View2View = require('../views/View2View');

var _View2View2 = _interopRequireDefault(_View2View);

var _index = require('../reducers/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _alp.newController)({
    index: function index(ctx) {
        return ctx.redirect(ctx.urlGenerator('default', { action: 'view1' }));
    },
    view1: function view1(ctx) {
        return ctx.render(_View1View2.default, _index2.default);
    },
    view2: function view2(ctx) {
        return ctx.render(_View2View2.default, _index2.default);
    }
});
//# sourceMappingURL=siteController.js.map
