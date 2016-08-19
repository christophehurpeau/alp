import ParamValueValidator from './ParamValueValidator';

export default class ParamValueModelValidator extends ParamValueValidator {
    /*
    required() {
        if (this.value == null) {
            this._error('required');
        }
        return this;
    }
    valid(fieldsRequired) {
        if (this.value == null) {
            return this;
        }
        if (S.isString(fieldsRequired)) {
            fieldsRequired = fieldsRequired.split(' ');
        }
        S.forEach(this.value.constructor.Fields, (name, fModel) => {
            let value = this.value[name];
            if (fieldsRequired) {
                if(S.array.has(fieldsRequired, name) && value == null) {
                    this._error('required');
                }
            } else {
                if (value == null && fModel[1] && fModel[1].required) {
                    this._error('required');
                }
            }
            //TODO ...
        });
        return this;
    }
     */
}
//# sourceMappingURL=ParamValueModelValidator.js.map