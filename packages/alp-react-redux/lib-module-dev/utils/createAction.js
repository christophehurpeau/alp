import t from "flow-runtime";
// eslint-disable-next-line flowtype/no-weak-types
var HandlerType = t.type("HandlerType", t.function(t.rest("args", t.array(t.any())), t.return(t.object())));


export default (function createAction(type, handler) {
  var _typeType = t.string();

  var _handlerType = t.nullable(HandlerType);

  t.param("type", _typeType).assert(type);
  t.param("handler", _handlerType).assert(handler);

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
});
//# sourceMappingURL=createAction.js.map