'use strict';

var _createClass = require('babel-runtime/helpers/create-class').default;

var _classCallCheck = require('babel-runtime/helpers/class-call-check').default;

var _Promise = require('babel-runtime/core-js/promise').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});
/** @class RequestContext 
* @param request 
* @param response */
let RequestContext = (function () {
    function RequestContext(request, response) {
        _classCallCheck(this, RequestContext);

        this.request = request;
        this.response = response;
        this.app = request.app;
    }

    /**
     *
     * @param {string} controllerName
     * @param {string} actionName
     * @returns {*}
     
    * @memberof RequestContext 
    * @instance 
    * @method callAction 
    * @param controllerName 
    * @param actionName */

    _createClass(RequestContext, [{
        key: 'callAction',
        value: function callAction(controllerName, actionName) {
            const route = this.request.route;
            if (!actionName) {
                actionName = controllerName;
                controllerName = route.controller;
            }

            const controller = this.app.controllers.get(route.controller);
            if (!controller) {
                return this.response.notFound(undefined, 'Controller not found: ' + controllerName);
            }

            const action = controller[actionName];
            if (!action /* || !action.isAction*/) {
                    return this.response.notFound(undefined, 'Action not found: ' + route.controller + '.' + route.action);
                }

            try {
                return _Promise.resolve(controller[actionName].call(this, this.request, this.response));
            } catch (err) {
                return _Promise.reject(err);
            }
        }
    }]);

    return RequestContext;
})();

exports.default = RequestContext;
module.exports = exports.default;
//# sourceMappingURL=RequestContext.js.map