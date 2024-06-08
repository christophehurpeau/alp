/// <reference types="koa" />
import type { Context } from "../AlpNodeApp";
import type { ParamValidationResult } from "./ParamValidationResult";
import ParamValueStringValidator from "./ParamValueStringValidator";
export declare class ParamValueFromContext {
    readonly validationResult: ParamValidationResult;
    readonly context: Context;
    constructor(context: Context, validationResult: ParamValidationResult);
    namedParam(name: string): ParamValueStringValidator;
    otherParam(position: number): ParamValueStringValidator;
    queryParam(name: string): ParamValueStringValidator;
}
//# sourceMappingURL=ParamValueFromContext.d.ts.map