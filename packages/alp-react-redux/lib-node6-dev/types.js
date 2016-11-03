'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleDescriptorType = exports.LayoutPropsType = exports.ReactElementType = exports.ReactNodeType = undefined;

var _types = require('fody/types');

Object.defineProperty(exports, 'ReactNodeType', {
  enumerable: true,
  get: function get() {
    return _types.ReactNodeType;
  }
});
Object.defineProperty(exports, 'ReactElementType', {
  enumerable: true,
  get: function get() {
    return _types.ReactElementType;
  }
});
Object.defineProperty(exports, 'LayoutPropsType', {
  enumerable: true,
  get: function get() {
    return _types.LayoutPropsType;
  }
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ModuleDescriptorType = exports.ModuleDescriptorType = _tcombForked2.default.interface({
  identifier: _tcombForked2.default.maybe(_tcombForked2.default.String)
}, 'ModuleDescriptorType');
//# sourceMappingURL=types.js.map