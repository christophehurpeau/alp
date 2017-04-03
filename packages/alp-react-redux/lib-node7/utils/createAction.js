"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (type, handler) => {
  const action = !handler ? () => ({ type }) : (...args) => Object.assign({ type }, handler(...args));
  action.type = type;
  action.toString = () => type;
  return action;
}; // eslint-disable-next-line flowtype/no-weak-types
//# sourceMappingURL=createAction.js.map