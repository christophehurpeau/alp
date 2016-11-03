'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fody = require('fody');

var _AlpHead = require('./AlpHead');

var _AlpHead2 = _interopRequireDefault(_AlpHead);

var _AlpBody = require('./AlpBody');

var _AlpBody2 = _interopRequireDefault(_AlpBody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = (_ref) => {
  let helmet = _ref.helmet,
      content = _ref.content,
      props = _objectWithoutProperties(_ref, ['helmet', 'content']);

  return _react2.default.createElement(
    _fody.Html,
    { helmet: helmet },
    _react2.default.createElement(_AlpHead2.default, _extends({ helmet: helmet }, props)),
    _react2.default.createElement(
      _AlpBody2.default,
      null,
      _react2.default.createElement('div', { id: 'app', dangerouslySetInnerHTML: { __html: content } })
    )
  );
};
//# sourceMappingURL=AlpLayout.js.map