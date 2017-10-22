'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Element = _flowRuntime2.default.tdz(() => _react.Element);

const Node = _flowRuntime2.default.tdz(() => _react.Node);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('children', _flowRuntime2.default.ref(Node))));

exports.default = function appContainer(_arg) {
  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(Element, _flowRuntime2.default.string('div')));

  let { children } = PropsType.assert(_arg);
  return _returnType.assert(_react2.default.createElement(
    'div',
    null,
    children
  ));
};
//# sourceMappingURL=AppContainer.js.map