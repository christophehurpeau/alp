import t from "flow-runtime";
// eslint-disable-next-line flowtype/no-weak-types
const HandlerType = t.type("HandlerType", t.function(t.rest("args", t.array(t.any())), t.return(t.object())));


export default (function createAction(type, handler) {
  let _typeType = t.string();

  let _handlerType = t.nullable(HandlerType);

  t.param("type", _typeType).assert(type), t.param("handler", _handlerType).assert(handler);

  const action = handler ? (...args) => Object.assign({ type }, handler(...args)) : () => ({ type });

  return action.type = type, action.toString = () => type, action;
});
//# sourceMappingURL=createAction.js.map