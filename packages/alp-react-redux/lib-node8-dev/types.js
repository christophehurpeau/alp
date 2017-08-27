'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReducerDictionaryType = exports.ReduxReducerType = exports.ReduxDispatchType = exports.ReduxActionType = exports.TagNameOrReactComponentType = exports.ReactComponentType = exports.ReactStatelessComponentType = exports.ReactClassComponentType = exports.TagNameType = exports.ReactNodeType = exports.ReactElementType = undefined;

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

const ReduxActionType = exports.ReduxActionType = _flowRuntime2.default.type('ReduxActionType', _flowRuntime2.default.object(_flowRuntime2.default.property('type', _flowRuntime2.default.string())));

const ReduxDispatchType = exports.ReduxDispatchType = _flowRuntime2.default.type('ReduxDispatchType', _flowRuntime2.default.function(_flowRuntime2.default.param('action', ReduxActionType), _flowRuntime2.default.return(_flowRuntime2.default.union(ReduxActionType, _flowRuntime2.default.any()))));

const ReduxReducerType = exports.ReduxReducerType = _flowRuntime2.default.type('ReduxReducerType', _flowRuntime2.default.function(_flowRuntime2.default.param('state', _flowRuntime2.default.any()), _flowRuntime2.default.param('action', ReduxActionType), _flowRuntime2.default.return(_flowRuntime2.default.any())));

const ReducerDictionaryType = exports.ReducerDictionaryType = _flowRuntime2.default.type('ReducerDictionaryType', _flowRuntime2.default.object(_flowRuntime2.default.indexer('key', _flowRuntime2.default.string(), ReduxReducerType)));
//# sourceMappingURL=types.js.map