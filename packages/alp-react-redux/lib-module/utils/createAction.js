

export default (function (type, handler) {
  var action = handler ? function () {
    return Object.assign({ type: type }, handler.apply(void 0, arguments));
  } : function () {
    return { type: type };
  };

  return action.type = type, action.toString = function () {
    return type;
  }, action;
}); // eslint-disable-next-line flowtype/no-weak-types
//# sourceMappingURL=createAction.js.map