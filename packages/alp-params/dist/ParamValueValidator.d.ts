import type ParamValidator from './ParamValidator';
export default class ParamValueValidator<T> {
    readonly validator: ParamValidator;
    readonly name: string;
    readonly value: T;
    constructor(validator: ParamValidator, name: string, value: T);
    _error(key: string): void;
}
//# sourceMappingURL=ParamValueValidator.d.ts.map