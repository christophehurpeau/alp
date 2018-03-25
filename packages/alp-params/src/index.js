import { defineLazyProperty } from 'object-properties';
import ParamValidator from './ParamValidator';
import ParamValidatorValid from './ParamValidatorValid';

export { ParamValidator };

export default function alpParams(app) {
  Object.assign(app.context, {
    param(name: string): ?string {
      return this.namedParam(name) || this.paramGET(name);
    },

    namedParam(name: string): ?string {
      const namedParams = this.route.namedParams;
      return namedParams && namedParams.get(name);
    },

    otherParam(position: number): ?string {
      const otherParams = this.route.otherParams;
      return otherParams && otherParams[position - 1];
    },

    paramGET(name: string): ?string {
      const query = this.query;
      return query && query[name];
    },

    paramGETorPOST(name: string): ?string {
      return this.body[name] !== undefined ? this.body[name] : this.query[name];
    },
  });

  defineLazyProperty(app.context, 'params', function(): ParamValidator {
    return new ParamValidator(this);
  });

  defineLazyProperty(app.context, 'validParams', function(): ParamValidatorValid {
    return new ParamValidatorValid(this);
  });
}
