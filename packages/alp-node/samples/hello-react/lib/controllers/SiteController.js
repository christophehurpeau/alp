'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _alp = require('alp');

var _viewsIndexView = require('../views/IndexView');

var _viewsIndexView2 = _interopRequireDefault(_viewsIndexView);

exports.default = (0, _alp.newController)({
    index: _alp.newController.action( /** @function 
                                      * @param request 
                                      * @param response */function (request, response) {
        const name = request.params.string('name').notEmpty().value;
        return this.render(_viewsIndexView2.default, { name });
    })
});
module.exports = exports.default;
//# sourceMappingURL=SiteController.js.map
