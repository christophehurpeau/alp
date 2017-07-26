'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let AlpReduxModule = (_temp = _class = class extends _react.Component {

  constructor(props, context) {
    super(props, context);
    this.context.setModuleReducers(props.reducers);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reducers !== this.props.reducers) {
      this.context.setModuleReducers(nextProps.reducers);
    }
  }

  render() {
    return this.props.children;
  }
}, _class.contextTypes = {
  setModuleReducers: _propTypes2.default.func.isRequired
}, _temp);
exports.default = AlpReduxModule;
//# sourceMappingURL=AlpReduxModuleBrowser.js.map