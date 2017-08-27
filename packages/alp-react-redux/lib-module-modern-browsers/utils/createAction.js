

export default (function (type, handler) {
  const action = !handler ? function () {
    return { type };
  } : function (...args) {
    return Object.assign({ type }, handler(...args));
  };
  action.type = type;
  action.toString = function () {
    return type;
  };
  return action;
}); // eslint-disable-next-line flowtype/no-weak-types
//# sourceMappingURL=createAction.js.map