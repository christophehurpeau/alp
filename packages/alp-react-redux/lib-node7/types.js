'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactNodeType = exports.ReactElementType = undefined;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

var _react = require('react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReactElementType = exports.ReactElementType = _flowRuntime2.default.refinement(_flowRuntime2.default.object(), input => {
  if (!(0, _react.isValidElement)(input)) return 'not a valid react element';
});

const ReactNodeType = exports.ReactNodeType = _flowRuntime2.default.type('React$Node', ReactNodeType => _flowRuntime2.default.union(_flowRuntime2.default.null(), _flowRuntime2.default.void(), _flowRuntime2.default.string(), _flowRuntime2.default.number(), ReactElementType, _flowRuntime2.default.array(ReactNodeType)));
//# sourceMappingURL=types.js.map