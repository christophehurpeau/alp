"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReducerDictionaryType = exports.ReduxReducerType = exports.ReduxDispatchType = exports.ReduxActionType = undefined;

var _flowRuntime = require("flow-runtime");

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReduxActionType = exports.ReduxActionType = _flowRuntime2.default.type("ReduxActionType", _flowRuntime2.default.object(_flowRuntime2.default.property("type", _flowRuntime2.default.string())));

const ReduxDispatchType = exports.ReduxDispatchType = _flowRuntime2.default.type("ReduxDispatchType", _flowRuntime2.default.function(_flowRuntime2.default.param("action", ReduxActionType), _flowRuntime2.default.return(_flowRuntime2.default.union(ReduxActionType, _flowRuntime2.default.any()))));

const ReduxReducerType = exports.ReduxReducerType = _flowRuntime2.default.type("ReduxReducerType", _flowRuntime2.default.function(_flowRuntime2.default.param("state", _flowRuntime2.default.any()), _flowRuntime2.default.param("action", ReduxActionType), _flowRuntime2.default.return(_flowRuntime2.default.any())));

const ReducerDictionaryType = exports.ReducerDictionaryType = _flowRuntime2.default.type("ReducerDictionaryType", _flowRuntime2.default.object(_flowRuntime2.default.indexer("key", _flowRuntime2.default.string(), ReduxReducerType)));
//# sourceMappingURL=types.js.map