'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'index.jsx';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.object(_flowRuntime2.default.property('tagName', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('to', _flowRuntime2.default.string()), _flowRuntime2.default.property('params', _flowRuntime2.default.nullable(_flowRuntime2.default.object())), _flowRuntime2.default.property('children', _flowRuntime2.default.nullable(_flowRuntime2.default.any()))));

const ContextType = _flowRuntime2.default.type('ContextType', _flowRuntime2.default.object(_flowRuntime2.default.property('context', _flowRuntime2.default.object(_flowRuntime2.default.property('urlGenerator', _flowRuntime2.default.function())))));

const LinkComponent = (_arg, _arg2) => {
  let _PropsType$assert = PropsType.assert(_arg),
      { tagName: TagName = 'a', to = 'default', params, children } = _PropsType$assert,
      props = _objectWithoutProperties(_PropsType$assert, ['tagName', 'to', 'params', 'children']);

  let { context: ctx } = ContextType.assert(_arg2);
  return _react2.default.createElement(
    TagName,
    _extends({ href: ctx.urlGenerator(to, params) }, props, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 20
      }
    }),
    children
  );
};

LinkComponent.contextTypes = {
  context: _react.PropTypes.shape({
    urlGenerator: _react.PropTypes.func
  })
};

exports.default = LinkComponent;
//# sourceMappingURL=index.js.map