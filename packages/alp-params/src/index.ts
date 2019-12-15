import { defineLazyProperty } from 'object-properties';
import { Context, NodeApplicationInCreation } from 'alp-types';
import ParamValidator from './ParamValidator';
import ParamValidatorValid from './ParamValidatorValid';

export { ParamValidator };

declare module 'alp-types' {
  interface Context {
    param(name: string): string | undefined;
    namedParam(name: string): string | undefined;
    otherParam(position: number): string | undefined;
    paramGET(name: string): string | undefined;
    paramGETorPOST(name: string): any | undefined;
  }
}

export default function alpParams(app: NodeApplicationInCreation) {
  Object.assign(app.context, {
    param(this: Context, name: string): string | undefined {
      return this.namedParam(name) || this.paramGET(name);
    },

    namedParam(this: Context, name: string): string | undefined {
      const namedParams = this.route.namedParams;
      return namedParams?.get(name);
    },

    otherParam(this: Context, position: number): string | undefined {
      const otherParams = this.route.otherParams;
      return otherParams && otherParams[position - 1];
    },

    paramGET(this: Context, name: string): string | undefined {
      const query = this.query;
      return query?.[name];
    },

    paramGETorPOST(this: Context, name: string): any | undefined {
      return this.body[name] !== undefined ? this.body[name] : this.query[name];
    },
  });

  defineLazyProperty(app.context, 'params', function(
    this: Context,
  ): ParamValidator {
    return new ParamValidator(this);
  });

  defineLazyProperty(app.context, 'validParams', function(
    this: Context,
  ): ParamValidatorValid {
    return new ParamValidatorValid(this);
  });
}
