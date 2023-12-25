import { ParamValidator } from './ParamValidator';

export default class ParamValidatorValid extends ParamValidator {
  override _error(): void {
    this.context.throw(404, 'Invalid params', { validator: this });
  }
}
