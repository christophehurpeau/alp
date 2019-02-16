import { Context } from 'alp-types';
import ParamValueStringValidator from './ParamValueStringValidator';
export interface Errors {
    [key: string]: any;
}
export default class ParamValidator {
    context: Context;
    _errors?: Errors;
    constructor(context: Context);
    _error(name: string, key: string, value: any): void;
    getErrors(): Errors | undefined;
    hasErrors(): boolean;
    isValid(): boolean;
    string(name: string): ParamValueStringValidator;
}
//# sourceMappingURL=ParamValidator.d.ts.map