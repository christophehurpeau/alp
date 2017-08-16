var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

import { Component } from 'react';
import PropTypes from 'prop-types';


export default (function (app, context) {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    function AlpAppWrapper() {
      return _classCallCheck(this, AlpAppWrapper), _possibleConstructorReturn(this, (AlpAppWrapper.__proto__ || Object.getPrototypeOf(AlpAppWrapper)).apply(this, arguments));
    }

    return _inherits(AlpAppWrapper, _Component), _createClass(AlpAppWrapper, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return context;
      }
    }, {
      key: 'render',
      value: function render() {
        return app;
      }
    }]), AlpAppWrapper;
  }(Component), _class.childContextTypes = {
    context: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    setModuleReducers: PropTypes.func
  }, _temp;
});
//# sourceMappingURL=createAlpAppWrapper.js.map