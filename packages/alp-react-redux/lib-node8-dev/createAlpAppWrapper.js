'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Element = _flowRuntime2.default.tdz(() => _react.Element);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.exactObject());

exports.default = function createAlpAppWrapper(app, context) {
  var _class, _temp2;

  let _appType = _flowRuntime2.default.ref(Element);

  let _contextType = _flowRuntime2.default.object();

  _flowRuntime2.default.param('app', _appType).assert(app);

  _flowRuntime2.default.param('context', _contextType).assert(context);

  return _temp2 = _class = class extends _react.Component {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.state = {
        error: null
      }, _temp;
    }

    getChildContext() {
      const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.object());

      return _returnType.assert(context);
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      console.error(error, errorInfo);
      if (window.Raven) window.Raven.captureException(error, { extra: errorInfo });
    }

    render() {
      const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Element));

      if (this.state.error) return _returnType2.assert(_react2.default.createElement(
        'div',
        null,
        'An unexpected error occured'
      ));
      return _returnType2.assert(app);
    }
  }, _class.propTypes = _flowRuntime2.default.propTypes(PropsType), _class.childContextTypes = {
    context: _propTypes2.default.object.isRequired,
    store: _propTypes2.default.object.isRequired,
    setModuleReducers: _propTypes2.default.func
  }, _temp2;
};
//# sourceMappingURL=createAlpAppWrapper.js.map