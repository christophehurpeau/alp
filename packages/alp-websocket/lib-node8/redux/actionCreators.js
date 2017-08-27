'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEmitAction = createEmitAction;
exports.createEmitPromiseAction = createEmitPromiseAction;

var _alpReactRedux = require('alp-react-redux');

function createEmitAction(type, argsNamesOrHandler) {
  return (0, _alpReactRedux.createAction)(type, argsNamesOrHandler, { meta: { websocket: true } });
} /* eslint-disable */
function createEmitPromiseAction(type, argsNamesOrHandler) {
  return (0, _alpReactRedux.createAction)(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}
//# sourceMappingURL=actionCreators.js.map