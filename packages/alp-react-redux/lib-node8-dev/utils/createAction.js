"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flowRuntime = require("flow-runtime");

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line flowtype/no-weak-types
const HandlerType = _flowRuntime2.default.type("HandlerType", _flowRuntime2.default.function(_flowRuntime2.default.rest("args", _flowRuntime2.default.array(_flowRuntime2.default.any())), _flowRuntime2.default.return(_flowRuntime2.default.object())));

exports.default = function createAction(type, handler) {
  let _typeType = _flowRuntime2.default.string();

  let _handlerType = _flowRuntime2.default.nullable(HandlerType);

  _flowRuntime2.default.param("type", _typeType).assert(type), _flowRuntime2.default.param("handler", _handlerType).assert(handler);

  const action = handler ? (...args) => Object.assign({ type }, handler(...args)) : () => ({ type });

  return action.type = type, action.toString = () => type, action;
};
//# sourceMappingURL=createAction.js.map