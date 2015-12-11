import ParamValidator from './ParamValidator';

export default class ParamValidatorValid extends ParamValidator {
    _error() {
        this.context.throw(404, 'Invalid params', { validator: this });
    }
}
