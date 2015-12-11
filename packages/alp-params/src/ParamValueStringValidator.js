import ParamValueValidator from './ParamValueValidator';

export default class ParamValueStringValidator extends ParamValueValidator {
    notEmpty() {
        if (this.value == null || this.value.trim() === '') {
            this._error('notEmpty');
        }

        return this;
    }
}
