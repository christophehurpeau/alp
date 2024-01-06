export type Errors = Record<string, any>;
export declare class ParamValidationResult {
    _errors?: Errors;
    _error(name: string, key: string, value: unknown): void;
    getErrors(): Errors | undefined;
    hasErrors(): boolean;
    isValid(): boolean;
}
//# sourceMappingURL=ParamValidationResult.d.ts.map