import type ParamValidator from './ParamValidator';
export default class ParamValueValidator {
    validator: ParamValidator;
    name: string;
    value: any;
    constructor(validator: ParamValidator, name: string, value: any);
    _error(key: string): void;
}
//# sourceMappingURL=ParamValueValidator.d.ts.map