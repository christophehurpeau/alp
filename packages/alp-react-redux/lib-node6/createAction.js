"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createAction;
function createAction(type, argsNames) {
    const action = argsNames ? function () {
        const action = { type };

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        args.forEach((value, index) => action[argsNames[index]] = value);
        return action;
    } : function (args) {
        return _extends({ type }, args);
    };

    action.type = type;
    action.toString = () => type;

    return action;
}
//# sourceMappingURL=createAction.js.map