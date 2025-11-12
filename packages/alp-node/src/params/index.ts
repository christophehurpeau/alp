import { defineLazyProperty } from "object-properties";
import type { AlpNodeApp, Context } from "../AlpNodeApp";
import ParamValid from "./ParamValid";
import { ParamValidationResult } from "./ParamValidationResult";
import { ParamValueFromContext } from "./ParamValueFromContext";

export interface AlpParamsContext {
  params: ParamValueFromContext;
  validParams: ParamValueFromContext;
  namedRouteParam: (name: string) => string | undefined;
  otherRouteParam: (position: number) => string | undefined;
  /** @deprecated use namedRouteParam */
  namedParam: never;
  /** @deprecated use otherRouteParam */
  otherParam: never;
  queryParam: (name: string) => string | undefined;
  bodyParam: <T>(name: string) => T | undefined;
}

export interface AlpParamsRequest {
  searchParams: URLSearchParams;
}

export default function alpParams(app: AlpNodeApp): void {
  Object.assign(app.context, {
    namedRouteParam(this: Context, name: string): string | undefined {
      const namedParams = this.route.namedParams;
      return namedParams?.get(name);
    },

    queryParam(this: Context, name: string): string | undefined {
      const searchParams = this.request.searchParams;
      return searchParams.get(name) ?? undefined;
    },

    bodyParam<T>(this: Context, name: string): T | undefined {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return (this.body as any)[name];
    },
  });

  defineLazyProperty(
    app.request,
    "searchParams",
    function searchParams(this: Context["request"]): URLSearchParams {
      return new URLSearchParams(this.search);
    },
  );

  defineLazyProperty(
    app.context,
    "params",
    function params(this: Context): ParamValueFromContext {
      return new ParamValueFromContext(this, new ParamValidationResult());
    },
  );

  defineLazyProperty(
    app.context,
    "validParams",
    function validParams(this: Context): ParamValueFromContext {
      return new ParamValueFromContext(this, new ParamValid(this));
    },
  );
}
