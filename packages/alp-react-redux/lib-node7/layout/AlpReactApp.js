'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactHelmet = require('react-helmet');

var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let App = (_temp = _class = class extends _react.Component {

  getChildContext() {
    return { context: this.props.context };
  }

  render() {
    const { children } = this.props;
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        _reactHelmet2.default,
        null,
        _react2.default.createElement('meta', { charSet: 'utf-8' }),
        _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' })
      ),
      children
    );
  }
}, _class.childContextTypes = {
  context: _propTypes2.default.object.isRequired
}, _temp);
exports.default = App;
//# sourceMappingURL=AlpReactApp.js.map