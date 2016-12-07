'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fody = require('fody');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function alpBodyJsx(_ref) {
  let { children } = _ref;

  let props = _objectWithoutProperties(_ref, ['children']);

  return _react2.default.createElement(
    _fody.Body,
    props,
    _react2.default.createElement(
      'div',
      { id: 'loading-bar', className: 'loading-bar' },
      _react2.default.createElement('div', { className: 'progress' })
    ),
    children
  );
};
//# sourceMappingURL=AlpBody.js.map