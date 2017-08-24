

export default (function (type, handler) {
  const action = handler ? function (...args) {
    return Object.assign({ type }, handler(...args));
  } : function () {
    return { type };
  };

  return action.type = type, action.toString = function () {
    return type;
  }, action;
}); // eslint-disable-next-line flowtype/no-weak-types
//# sourceMappingURL=createAction.js.map