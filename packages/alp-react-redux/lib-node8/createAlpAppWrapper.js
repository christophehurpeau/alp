'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (app, context) => {
  var _class, _temp2;

  return _temp2 = _class = class extends _react.Component {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.state = {
        error: null
      }, _temp;
    }

    getChildContext() {
      return context;
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      console.error(error, errorInfo);
      if (window.Raven) window.Raven.captureException(error, { extra: errorInfo });
    }

    render() {
      if (this.state.error) return _react2.default.createElement(
        'div',
        null,
        'An unexpected error occured'
      );
      return app;
    }
  }, _class.childContextTypes = {
    context: _propTypes2.default.object.isRequired,
    store: _propTypes2.default.object.isRequired,
    setModuleReducers: _propTypes2.default.func
  }, _temp2;
};
//# sourceMappingURL=createAlpAppWrapper.js.map