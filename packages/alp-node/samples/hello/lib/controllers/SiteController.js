'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _alp = require('alp');

var _viewsTuracoView = require('../views/TuracoView');

var _viewsTuracoView2 = _interopRequireDefault(_viewsTuracoView);

exports.default = (0, _alp.newController)({
    index: _alp.newController.action( /** @function 
                                      * @param request 
                                      * @param response */function (request, response) {
        const name = request.params.string('name').notEmpty().value;
        return response.end(this.t('Hello %s!', request.params.isValid() ? name : 'World'));
    }),

    turaco: _alp.newController.action( /** @function 
                                       * @param request 
                                       * @param response */function (request, response) {
        const name = request.params.string('name').notEmpty().value;
        return this.render(_viewsTuracoView2.default);
    })
});
module.exports = exports.default;
//# sourceMappingURL=SiteController.js.map
