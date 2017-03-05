'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleDescriptorType = exports.LayoutPropsType = exports.ReactElementType = exports.ReactNodeType = undefined;

var _types = require('fody/types');

Object.defineProperty(exports, 'ReactNodeType', {
  enumerable: true,
  get: function () {
    return _types.ReactNodeType;
  }
});
Object.defineProperty(exports, 'ReactElementType', {
  enumerable: true,
  get: function () {
    return _types.ReactElementType;
  }
});
Object.defineProperty(exports, 'LayoutPropsType', {
  enumerable: true,
  get: function () {
    return _types.LayoutPropsType;
  }
});

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ModuleDescriptorType = exports.ModuleDescriptorType = _flowRuntime2.default.type('ModuleDescriptorType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('identifier', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('View', _flowRuntime2.default.any()), _flowRuntime2.default.property('reducer', _flowRuntime2.default.nullable(_flowRuntime2.default.function())), _flowRuntime2.default.property('reducers', _flowRuntime2.default.nullable(_flowRuntime2.default.object())), _flowRuntime2.default.property('loader', _flowRuntime2.default.nullable(_flowRuntime2.default.function()))));
//# sourceMappingURL=types.js.map