'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _alp = require('alp');

var _index = require('../views/index');

var appDescriptor = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = (0, _alp.newController)({
    index(ctx) {
        const name = ctx.params.string('name').notEmpty().value;
        return ctx.render(appDescriptor, { name });
    }
});
//# sourceMappingURL=siteController.js.map
