import type { Context } from '../AlpNodeApp';
import { ParamValidationResult } from './ParamValidationResult';

export default class ParamValid extends ParamValidationResult {
  context: Context;

  constructor(context: Context) {
    super();
    this.context = context;
  }

  override _error(): void {
    this.context.throw(400, 'Invalid params', { validator: this });
  }
}
