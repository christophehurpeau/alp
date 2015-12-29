'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _alp = require('alp');

var _IndexView = require('../views/IndexView');

var _IndexView2 = _interopRequireDefault(_IndexView);

var _index = require('../reducers/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _alp.newController)({
    index: function index(ctx) {
        const name = ctx.params.string('name').notEmpty().value;
        return ctx.render(_IndexView2.default, _index2.default, { name });
    }
});
//# sourceMappingURL=siteController.js.map
