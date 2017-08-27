'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEmitAction = createEmitAction;
exports.createEmitPromiseAction = createEmitPromiseAction;

var _alpReactRedux = require('alp-react-redux');

var _alpReactRedux2 = _interopRequireDefault(_alpReactRedux);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createEmitAction(type, argsNamesOrHandler) {
  return (0, _alpReactRedux2.default)(type, argsNamesOrHandler, { meta: { websocket: true } });
}

function createEmitPromiseAction(type, argsNamesOrHandler) {
  return (0, _alpReactRedux2.default)(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}
//# sourceMappingURL=actionCreators.js.map