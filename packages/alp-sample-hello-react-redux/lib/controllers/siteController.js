'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _alpController = require('alp-controller');

var _alpController2 = _interopRequireDefault(_alpController);

var _index = require('../views/index');

var appDescriptor = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _alpController2.default)({
    index: function index(ctx) {
        const name = ctx.params.string('name').notEmpty().value;
        return ctx.render(appDescriptor, { name: name });
    }
});
//# sourceMappingURL=siteController.js.map
