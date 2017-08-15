var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

export default ((type, handler) => {
  const action = !handler ? () => ({ type }) : (...args) => _extends({ type }, handler(...args));
  action.type = type;
  action.toString = () => type;
  return action;
}); // eslint-disable-next-line flowtype/no-weak-types
//# sourceMappingURL=createAction.js.map