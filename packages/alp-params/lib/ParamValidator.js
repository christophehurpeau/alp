'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _ParamValueStringValidator = require('./ParamValueStringValidator');

var _ParamValueStringValidator2 = _interopRequireDefault(_ParamValueStringValidator);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ParamValidator = class ParamValidator {
    /**
     * @param context
    */
    constructor(context) {
        this.context = context;
    }

    /**
     * @param name
     * @param key
     * @param value
    */_error(name, key, value) {
        if (!this._errors) {
            this._errors = {};
        }

        this._errors[name] = { error: key, value: value };
    }

    getErrors() {
        return this._errors;
    }

    hasErrors() {
        return !!this._errors;
    }

    isValid() {
        return !this._errors;
    }

    /**
     * @param name
     * @param position
    */string(name, position) {
        return new _ParamValueStringValidator2.default(this, name, this.context.param(name, position));
    }
    /* int(name, position) {
        return new ParamValueIntValidator(this, name, this.context.param(name, position));
    }
    model(modelName, name) {
        name = name || S.string.lcFirst(modelName);
        console.log('paramvalidator model', modelName, M[modelName]);
        let data = this.context.getOrPostParam(name);
        return new ParamValueModelValidator(this, name, !data ? null : new M[modelName](data));
    }*/
};
exports.default = ParamValidator;
//# sourceMappingURL=ParamValidator.js.map