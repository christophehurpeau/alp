'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReduxDispatchType = exports.ReduxActionType = exports.ModuleDescriptorType = exports.TagNameOrReactComponentType = exports.ReactComponentType = exports.ReactStatelessComponentType = exports.ReactClassComponentType = exports.TagNameType = exports.ReactNodeType = exports.ReactElementType = void 0;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

var _react = require('react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReactElementType = exports.ReactElementType = _flowRuntime2.default.refinement(_flowRuntime2.default.object(), input => {
  if (!(0, _react.isValidElement)(input)) return 'not a valid react element';
});

const ReactNodeType = exports.ReactNodeType = _flowRuntime2.default.type('React$Node', ReactNodeType => _flowRuntime2.default.union(_flowRuntime2.default.null(), _flowRuntime2.default.void(), _flowRuntime2.default.string(), _flowRuntime2.default.number(), ReactElementType, _flowRuntime2.default.array(ReactNodeType)));

const TagNameType = exports.TagNameType = _flowRuntime2.default.type('TagNameType', _flowRuntime2.default.string());

const ReactClassComponentType = exports.ReactClassComponentType = _flowRuntime2.default.type('ReactClassComponentType', _flowRuntime2.default.ref(_react.Component));

const ReactStatelessComponentType = exports.ReactStatelessComponentType = _flowRuntime2.default.type('ReactStatelessComponentType', _flowRuntime2.default.function(_flowRuntime2.default.param('props', _flowRuntime2.default.object()), _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactNodeType))));

const ReactComponentType = exports.ReactComponentType = _flowRuntime2.default.type('ReactComponentType', _flowRuntime2.default.union(ReactClassComponentType, ReactStatelessComponentType));

const TagNameOrReactComponentType = exports.TagNameOrReactComponentType = _flowRuntime2.default.type('TagNameOrReactComponentType', _flowRuntime2.default.union(TagNameType, ReactComponentType));

const ModuleDescriptorType = exports.ModuleDescriptorType = _flowRuntime2.default.type('ModuleDescriptorType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('identifier', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('View', _flowRuntime2.default.any()), _flowRuntime2.default.property('reducer', _flowRuntime2.default.nullable(_flowRuntime2.default.function())), _flowRuntime2.default.property('reducers', _flowRuntime2.default.nullable(_flowRuntime2.default.object())), _flowRuntime2.default.property('loader', _flowRuntime2.default.nullable(_flowRuntime2.default.function()))));

const ReduxActionType = exports.ReduxActionType = _flowRuntime2.default.type('ReduxActionType', _flowRuntime2.default.object(_flowRuntime2.default.property('type', _flowRuntime2.default.string())));

const ReduxDispatchType = exports.ReduxDispatchType = _flowRuntime2.default.type('ReduxDispatchType', _flowRuntime2.default.function(_flowRuntime2.default.param('action', ReduxActionType), _flowRuntime2.default.return(_flowRuntime2.default.union(ReduxActionType, _flowRuntime2.default.any()))));
//# sourceMappingURL=types.js.map