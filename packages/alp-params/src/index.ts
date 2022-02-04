import type { Context, NodeApplicationInCreation } from 'alp-types';
import 'alp-router';
import { defineLazyProperty } from 'object-properties';
import { ParamValidator } from './ParamValidator';
import ParamValidatorValid from './ParamValidatorValid';

export { ParamValidator } from './ParamValidator';

declare module 'alp-types' {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface Context {
    params: ParamValidator;
    validParams: ParamValidator;
    param: (name: string) => string | undefined;
    namedParam: (name: string) => string | undefined;
    otherParam: (position: number) => string | undefined;
    paramGET: (name: string) => string | undefined;
    paramGETorPOST: <T>(name: string) => T | undefined;
  }
}

export default function alpParams(app: NodeApplicationInCreation): void {
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
      const searchParams = this.request.searchParams;
      return searchParams.get(name) ?? undefined;
    },

    paramGETorPOST<T>(this: Context, name: string): T | undefined {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      return this.body[name] !== undefined
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          this.body[name]
        : this.paramGET(name);
    },
  });

  defineLazyProperty(
    app.context,
    'params',
    function (this: Context): ParamValidator {
      return new ParamValidator(this);
    },
  );

  defineLazyProperty(
    app.context,
    'validParams',
    function (this: Context): ParamValidatorValid {
      return new ParamValidatorValid(this);
    },
  );
}
