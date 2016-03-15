'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = aukParams;

var _objectProperties = require('object-properties');

var _ParamValidator = require('./ParamValidator');

var _ParamValidator2 = _interopRequireDefault(_ParamValidator);

var _ParamValidatorValid = require('./ParamValidatorValid');

var _ParamValidatorValid2 = _interopRequireDefault(_ParamValidatorValid);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function
 * @param app
*/function aukParams(app) {
    Object.assign(app.context, {
        param: /**
                * @function
                * @param name
               */function param(name) {
            return this.namedParam(name) || this.paramGET(name);
        },
        namedParam: /**
                     * @function
                     * @param name
                    */function namedParam(name) {
            let namedParams = this.route.namedParams;
            return namedParams && namedParams.get(name);
        },
        otherParam: /**
                     * @function
                     * @param position
                    */function otherParam(position) {
            let otherParams = this.route.otherParams;
            return otherParams && otherParams[position - 1];
        },
        paramGET: /**
                   * @function
                   * @param name
                  */function paramGET(name) {
            let query = this.query;
            return query && query[name];
        },
        paramGETorPOST: /**
                         * @function
                         * @param name
                        */function paramGETorPOST(name) {
            return this.body[name] !== undefined ? this.body[name] : this.query[name];
        }
    });

    (0, _objectProperties.defineLazyProperty)(app.context, 'params', /**
                                                                      * @function
                                                                     */function () {
        return new _ParamValidator2.default(this);
    });
    (0, _objectProperties.defineLazyProperty)(app.context, 'validParams', /**
                                                                           * @function
                                                                          */function () {
        return new _ParamValidatorValid2.default(this);
    });
}
//# sourceMappingURL=index.js.map