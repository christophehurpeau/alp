var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { Component } from 'react';
import PropTypes from 'prop-types';
var AlpReduxModule = (_temp = _class = function (_Component) {
  _inherits(AlpReduxModule, _Component);

  function AlpReduxModule(props, context) {
    _classCallCheck(this, AlpReduxModule);

    var _this = _possibleConstructorReturn(this, (AlpReduxModule.__proto__ || Object.getPrototypeOf(AlpReduxModule)).call(this, props, context));

    _this.context.setModuleReducers(props.reducers);
    return _this;
  }

  _createClass(AlpReduxModule, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.reducers !== this.props.reducers) {
        this.context.setModuleReducers(nextProps.reducers);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return AlpReduxModule;
}(Component), _class.contextTypes = {
  setModuleReducers: PropTypes.func.isRequired
}, _temp);
export { AlpReduxModule as default };
//# sourceMappingURL=AlpReduxModuleBrowser.js.map