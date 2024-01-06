import type { ParamValidationResult } from './ParamValidationResult';
export default class ParamValueValidator<T> {
    readonly validationResult: ParamValidationResult;
    readonly name: string;
    readonly value: T;
    constructor(validationResult: ParamValidationResult, name: string, value: T);
    isValid(): boolean;
    _error(key: string): void;
}
//# sourceMappingURL=ParamValueValidator.d.ts.map