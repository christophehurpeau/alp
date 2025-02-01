import type { Context } from "../AlpNodeApp";
import { ParamValidationResult } from "./ParamValidationResult";
export default class ParamValid extends ParamValidationResult {
    context: Context;
    constructor(context: Context);
    _error(): void;
}
//# sourceMappingURL=ParamValid.d.ts.map