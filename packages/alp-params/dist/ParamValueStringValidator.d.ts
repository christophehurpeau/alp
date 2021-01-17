import ParamValueValidator from './ParamValueValidator';
export default class ParamValueStringValidator<T extends string = string> extends ParamValueValidator<T | undefined | null> {
    notEmpty(): ParamValueValidator<T>;
}
//# sourceMappingURL=ParamValueStringValidator.d.ts.map