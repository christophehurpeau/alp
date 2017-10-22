var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import React from 'react';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { Component } from 'react';
import PropTypes from 'prop-types';

export default (function (app, context) {
  var _class, _temp2;

  return _temp2 = _class = function (_Component) {
    _inherits(AlpAppWrapper, _Component);

    function AlpAppWrapper() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, AlpAppWrapper);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AlpAppWrapper.__proto__ || Object.getPrototypeOf(AlpAppWrapper)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        error: null
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(AlpAppWrapper, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return context;
      }
    }, {
      key: 'componentDidCatch',
      value: function componentDidCatch(error, errorInfo) {
        this.setState({ error: error });
        console.error(error, errorInfo);
        if (window.Raven) window.Raven.captureException(error, { extra: errorInfo });
      }
    }, {
      key: 'render',
      value: function render() {
        if (this.state.error) return React.createElement(
          'div',
          null,
          'An unexpected error occured'
        );
        return app;
      }
    }]);

    return AlpAppWrapper;
  }(Component), _class.childContextTypes = {
    context: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    setModuleReducers: PropTypes.func
  }, _temp2;
});
//# sourceMappingURL=createAlpAppWrapper.js.map