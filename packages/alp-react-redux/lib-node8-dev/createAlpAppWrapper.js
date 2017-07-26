'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'createAlpAppWrapper.jsx';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BrowserAppContainer = require('alp-dev/BrowserAppContainer');

var _BrowserAppContainer2 = _interopRequireDefault(_BrowserAppContainer);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _types = require('./types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReactNodeType = _flowRuntime2.default.tdz(() => _types.ReactNodeType);

const ReactComponentType = _flowRuntime2.default.tdz(() => _types.ReactComponentType);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.exactObject());

exports.default = function createAlpAppWrapper(App, context) {
  var _class, _temp;

  let _AppType = _flowRuntime2.default.ref(ReactComponentType);

  let _contextType = _flowRuntime2.default.object();

  _flowRuntime2.default.param('App', _AppType).assert(App);

  _flowRuntime2.default.param('context', _contextType).assert(context);

  return _temp = _class = class extends _react.Component {

    getChildContext() {
      const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.object());

      return _returnType.assert(context);
    }

    render() {
      const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactNodeType));

      return _returnType2.assert(_react2.default.createElement(
        _BrowserAppContainer2.default,
        {
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 26
          }
        },
        _react2.default.createElement(App, {
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 27
          }
        })
      ));
    }
  }, _class.propTypes = _flowRuntime2.default.propTypes(PropsType), _class.childContextTypes = {
    context: _propTypes2.default.object.isRequired,
    app: _propTypes2.default.object.isRequired,
    store: _propTypes2.default.object.isRequired,
    setModuleReducers: _propTypes2.default.func.isRequired
  }, _temp;
};
//# sourceMappingURL=createAlpAppWrapper.js.map