import { defineLazyProperty } from 'object-properties';
import ParamValidator from './ParamValidator';
import ParamValidatorValid from './ParamValidatorValid';

export { ParamValidator };

export default function alpParams(app) {
  Object.assign(app.context, {
    param: function param(name) {
      return this.namedParam(name) || this.paramGET(name);
    },
    namedParam: function namedParam(name) {
      var namedParams = this.route.namedParams;
      return namedParams && namedParams.get(name);
    },
    otherParam: function otherParam(position) {
      var otherParams = this.route.otherParams;
      return otherParams && otherParams[position - 1];
    },
    paramGET: function paramGET(name) {
      var query = this.query;
      return query && query[name];
    },
    paramGETorPOST: function paramGETorPOST(name) {
      return this.body[name] === void 0 ? this.query[name] : this.body[name];
    }
  }), defineLazyProperty(app.context, 'params', function () {
    return new ParamValidator(this);
  }), defineLazyProperty(app.context, 'validParams', function () {
    return new ParamValidatorValid(this);
  });
}
//# sourceMappingURL=index.js.map