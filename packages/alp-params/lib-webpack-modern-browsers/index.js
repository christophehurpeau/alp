import { defineLazyProperty } from 'object-properties';
import ParamValidator from './ParamValidator';
import ParamValidatorValid from './ParamValidatorValid';

export { ParamValidator };

export default function alpParams(app) {
  Object.assign(app.context, {
    param(name) {
      return this.namedParam(name) || this.paramGET(name);
    },

    namedParam(name) {
      var namedParams = this.route.namedParams;
      return namedParams && namedParams.get(name);
    },

    otherParam(position) {
      var otherParams = this.route.otherParams;
      return otherParams && otherParams[position - 1];
    },

    paramGET(name) {
      var query = this.query;
      return query && query[name];
    },

    paramGETorPOST(name) {
      return this.body[name] !== undefined ? this.body[name] : this.query[name];
    }
  });

  defineLazyProperty(app.context, 'params', function () {
    return new ParamValidator(this);
  });

  defineLazyProperty(app.context, 'validParams', function () {
    return new ParamValidatorValid(this);
  });
}
//# sourceMappingURL=index.js.map