var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import AlpModule from './AlpModule';
import { ReactNodeType as _ReactNodeType, ReactElementType as _ReactElementType, ReducerDictionaryType as _ReducerDictionaryType } from '../types';

import t from 'flow-runtime';
var ReactNodeType = t.tdz(function () {
  return _ReactNodeType;
});
var ReactElementType = t.tdz(function () {
  return _ReactElementType;
});
var ReducerDictionaryType = t.tdz(function () {
  return _ReducerDictionaryType;
});
var PropsType = t.type('PropsType', t.exactObject(t.property('reducers', t.nullable(t.ref(ReducerDictionaryType))), t.property('children', t.ref(ReactNodeType))));
var AlpReduxModule = (_temp = _class = function (_AlpModule) {
  _inherits(AlpReduxModule, _AlpModule);

  function AlpReduxModule(props, context) {
    _classCallCheck(this, AlpReduxModule);

    var _this = _possibleConstructorReturn(this, (AlpReduxModule.__proto__ || Object.getPrototypeOf(AlpReduxModule)).call(this, props, context));

    _this.state = {
      loading: _this.setModuleReducers(props.reducers)
    };
    return _this;
  }

  _createClass(AlpReduxModule, [{
    key: 'setModuleReducers',
    value: function setModuleReducers(reducers) {
      var _this2 = this;

      if (!this.context.setModuleReducers) return false; // pre render
      var result = this.context.setModuleReducers(reducers);
      if (result === false) return false;
      result.then(function () {
        _this2.setState({ loading: false });
      });
      return true;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _nextPropsType = t.ref(PropTypes);

      t.param('nextProps', _nextPropsType).assert(nextProps);

      if (nextProps.reducers !== this.props.reducers) {
        this.setState({
          loading: this.setModuleReducers(nextProps.reducers)
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _returnType = t.return(t.union(t.ref(ReactElementType), t.null()));

      return _returnType.assert(this.state.loading ? null : this.props.children);
    }
  }]);

  return AlpReduxModule;
}(AlpModule), _class.contextTypes = {
  setModuleReducers: PropTypes.func.isRequired
}, _temp);
export { AlpReduxModule as default };
//# sourceMappingURL=AlpReduxModuleBrowser.js.map