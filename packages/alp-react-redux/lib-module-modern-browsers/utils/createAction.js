var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]); } return target; };

export default (function (type, handler) {
  const action = handler ? function (...args) {
    return _extends({ type }, handler(...args));
  } : function () {
    return { type };
  };

  return action.type = type, action.toString = function () {
    return type;
  }, action;
}); // eslint-disable-next-line flowtype/no-weak-types
//# sourceMappingURL=createAction.js.map