import type { Context } from '../AlpNodeApp';
import type { ParamValidationResult } from './ParamValidationResult';
import ParamValueStringValidator from './ParamValueStringValidator';

export class ParamValueFromContext {
  readonly validationResult: ParamValidationResult;

  readonly context: Context;

  constructor(context: Context, validationResult: ParamValidationResult) {
    this.validationResult = validationResult;
    this.context = context;
  }

  namedParam(name: string): ParamValueStringValidator {
    return new ParamValueStringValidator(
      this.validationResult,
      name,
      this.context.namedParam(name),
    );
  }

  otherParam(position: number): ParamValueStringValidator {
    return new ParamValueStringValidator(
      this.validationResult,
      String(position),
      this.context.otherParam(position),
    );
  }

  queryParam(name: string): ParamValueStringValidator {
    return new ParamValueStringValidator(
      this.validationResult,
      name,
      this.context.queryParam(name),
    );
  }

  // bodyParam: <T>(name: string): ParamValueValidator<string | undefined> {

  // }
}
