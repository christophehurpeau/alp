var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]); } return target; };

import t from "flow-runtime";
// eslint-disable-next-line flowtype/no-weak-types
const HandlerType = t.type("HandlerType", t.function(t.rest("args", t.array(t.any())), t.return(t.object())));


export default (function createAction(type, handler) {
  let _typeType = t.string();

  let _handlerType = t.nullable(HandlerType);

  t.param("type", _typeType).assert(type), t.param("handler", _handlerType).assert(handler);

  const action = handler ? function (...args) {
    return _extends({ type }, handler(...args));
  } : function () {
    return { type };
  };

  return action.type = type, action.toString = function () {
    return type;
  }, action;
});
//# sourceMappingURL=createAction.js.map