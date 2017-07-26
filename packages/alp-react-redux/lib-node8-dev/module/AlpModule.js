'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReactNodeType = _flowRuntime2.default.tdz(() => _types.ReactNodeType);

const ReactElementType = _flowRuntime2.default.tdz(() => _types.ReactElementType);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('children', _flowRuntime2.default.ref(ReactNodeType))));

exports.default = function alpModule(_arg) {
  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactElementType));

  let { children } = PropsType.assert(_arg);
  return _returnType.assert(children);
};
//# sourceMappingURL=AlpModule.js.map