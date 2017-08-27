

export default (function (type, handler) {
  var action = !handler ? function () {
    return { type: type };
  } : function () {
    return Object.assign({ type: type }, handler.apply(undefined, arguments));
  };
  action.type = type;
  action.toString = function () {
    return type;
  };
  return action;
}); // eslint-disable-next-line flowtype/no-weak-types
//# sourceMappingURL=createAction.js.map