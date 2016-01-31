"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
let ParamValueValidator = class ParamValueValidator {
    /**
     * @param validator
     * @param name
     * @param value
    */
    constructor(validator, name, value) {
        this.validator = validator;
        this.name = name;
        this.value = value;
    }

    /**
     * @param key
    */_error(key) {
        this.validator._error(this.name, key, this.value);
    }
};
exports.default = ParamValueValidator;
//# sourceMappingURL=ParamValueValidator.js.map