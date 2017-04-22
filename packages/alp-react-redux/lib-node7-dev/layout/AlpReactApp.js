'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class,
    _temp,
    _jsxFileName = 'layout/AlpReactApp.jsx';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactHelmet = require('react-helmet');

var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReactNodeType = _flowRuntime2.default.tdz(() => _types.ReactNodeType);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('children', _flowRuntime2.default.nullable(_flowRuntime2.default.ref(ReactNodeType)))));

let App = (_temp = _class = class extends _react.Component {

  getChildContext() {
    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.object());

    return _returnType.assert({ context: this.props.context });
  }

  render() {
    const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactNodeType));

    const { children } = this.props;
    return _returnType2.assert(_react2.default.createElement(
      'div',
      {
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 24
        }
      },
      _react2.default.createElement(
        _reactHelmet2.default,
        {
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 25
          }
        },
        _react2.default.createElement('meta', { charSet: 'utf-8', __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 26
          }
        }),
        _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1', __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 27
          }
        })
      ),
      children
    ));
  }
}, _class.propTypes = _flowRuntime2.default.propTypes(PropsType), _class.childContextTypes = {
  context: _propTypes2.default.object.isRequired
}, _temp);
exports.default = App;
//# sourceMappingURL=AlpReactApp.js.map