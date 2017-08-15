'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (app, context) => {
  var _class, _temp;

  return _temp = _class = class extends _react.Component {

    getChildContext() {
      return context;
    }

    render() {
      return app;
    }
  }, _class.childContextTypes = {
    context: _propTypes2.default.object.isRequired,
    store: _propTypes2.default.object.isRequired,
    setModuleReducers: _propTypes2.default.func
  }, _temp;
};
//# sourceMappingURL=createAlpAppWrapper.js.map