"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]); } return target; };

exports.default = (type, handler) => {
  const action = handler ? (...args) => _extends({ type }, handler(...args)) : () => ({ type });

  return action.type = type, action.toString = () => type, action;
}; // eslint-disable-next-line flowtype/no-weak-types
//# sourceMappingURL=createAction.js.map