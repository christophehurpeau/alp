'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _LoginButtonGoogle = require('./LoginButtonGoogle');

var _LoginButtonGoogle2 = _interopRequireDefault(_LoginButtonGoogle);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Element = _flowRuntime2.default.tdz(() => _react.Element);

exports.default = function loginButtons() {
  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(Element, _flowRuntime2.default.string('ul')));

  return _returnType.assert(_react2.default.createElement(
    'ul',
    null,
    _react2.default.createElement(
      'li',
      null,
      _react2.default.createElement(_LoginButtonGoogle2.default, null)
    )
  ));
};
//# sourceMappingURL=LoginButtons.js.map