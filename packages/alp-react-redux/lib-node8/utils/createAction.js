"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (type, handler) => {
  const action = handler ? (...args) => Object.assign({ type }, handler(...args)) : () => ({ type });

  return action.type = type, action.toString = () => type, action;
}; // eslint-disable-next-line flowtype/no-weak-types
//# sourceMappingURL=createAction.js.map