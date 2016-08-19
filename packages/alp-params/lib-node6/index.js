'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParamValidator = undefined;
exports.default = alpParams;

var _objectProperties = require('object-properties');

var _ParamValidator = require('./ParamValidator');

var _ParamValidator2 = _interopRequireDefault(_ParamValidator);

var _ParamValidatorValid = require('./ParamValidatorValid');

var _ParamValidatorValid2 = _interopRequireDefault(_ParamValidatorValid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.ParamValidator = _ParamValidator2.default;
function alpParams(app) {
  Object.assign(app.context, {
    param(name) {
      return this.namedParam(name) || this.paramGET(name);
    },

    namedParam(name) {
      let namedParams = this.route.namedParams;
      return namedParams && namedParams.get(name);
    },

    otherParam(position) {
      let otherParams = this.route.otherParams;
      return otherParams && otherParams[position - 1];
    },

    paramGET(name) {
      let query = this.query;
      return query && query[name];
    },

    paramGETorPOST(name) {
      return this.body[name] !== undefined ? this.body[name] : this.query[name];
    }
  });

  (0, _objectProperties.defineLazyProperty)(app.context, 'params', function () {
    return new _ParamValidator2.default(this);
  });

  (0, _objectProperties.defineLazyProperty)(app.context, 'validParams', function () {
    return new _ParamValidatorValid2.default(this);
  });
}
//# sourceMappingURL=index.js.map