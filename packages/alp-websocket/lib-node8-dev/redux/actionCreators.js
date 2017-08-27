'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEmitAction = createEmitAction;
exports.createEmitPromiseAction = createEmitPromiseAction;

var _alpReactRedux = require('alp-react-redux');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */
const ArgsNamesOfHandlerType = _flowRuntime2.default.type('ArgsNamesOfHandlerType', _flowRuntime2.default.union(_flowRuntime2.default.array(_flowRuntime2.default.string()), _flowRuntime2.default.string(), _flowRuntime2.default.function()));

function createEmitAction(type, argsNamesOrHandler) {
  let _typeType = _flowRuntime2.default.string();

  let _argsNamesOrHandlerType = _flowRuntime2.default.nullable(ArgsNamesOfHandlerType);

  _flowRuntime2.default.param('type', _typeType).assert(type);

  _flowRuntime2.default.param('argsNamesOrHandler', _argsNamesOrHandlerType).assert(argsNamesOrHandler);

  return (0, _alpReactRedux.createAction)(type, argsNamesOrHandler, { meta: { websocket: true } });
}

function createEmitPromiseAction(type, argsNamesOrHandler) {
  let _typeType2 = _flowRuntime2.default.string();

  let _argsNamesOrHandlerType2 = _flowRuntime2.default.union(_flowRuntime2.default.nullable(_flowRuntime2.default.array(_flowRuntime2.default.string())), _flowRuntime2.default.string(), _flowRuntime2.default.function());

  _flowRuntime2.default.param('type', _typeType2).assert(type);

  _flowRuntime2.default.param('argsNamesOrHandler', _argsNamesOrHandlerType2).assert(argsNamesOrHandler);

  return (0, _alpReactRedux.createAction)(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}
//# sourceMappingURL=actionCreators.js.map