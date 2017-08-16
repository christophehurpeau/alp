'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;

var _ParamValueValidator = require('./ParamValueValidator');

var _ParamValueValidator2 = _interopRequireDefault(_ParamValueValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ParamValueModelValidator = class extends _ParamValueValidator2.default {
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
};
exports.default = ParamValueModelValidator;
//# sourceMappingURL=ParamValueModelValidator.js.map