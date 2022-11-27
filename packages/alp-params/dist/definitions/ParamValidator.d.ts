import type { Context } from 'alp-types';
import ParamValueStringValidator from './ParamValueStringValidator';
export type Errors = Record<string, any>;
export declare class ParamValidator {
    context: Context;
    _errors?: Errors;
    constructor(context: Context);
    _error(name: string, key: string, value: unknown): void;
    getErrors(): Errors | undefined;
    hasErrors(): boolean;
    isValid(): boolean;
    string(name: string): ParamValueStringValidator;
}
//# sourceMappingURL=ParamValidator.d.ts.map