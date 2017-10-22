'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class, _temp;

require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _AlpModule = require('./AlpModule');

var _AlpModule2 = _interopRequireDefault(_AlpModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let AlpReduxModule = (_temp = _class = class extends _AlpModule2.default {

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: this.setModuleReducers(props.reducers)
    };
  }

  setModuleReducers(reducers) {
    if (!this.context.setModuleReducers) return false; // pre render
    const result = this.context.setModuleReducers(reducers);
    if (result === false) return false;
    result.then(() => {
      this.setState({ loading: false });
    });
    return true;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reducers !== this.props.reducers) {
      this.setState({
        loading: this.setModuleReducers(nextProps.reducers)
      });
    }
  }

  render() {
    return this.state.loading ? null : this.props.children;
  }
}, _class.contextTypes = {
  setModuleReducers: _propTypes2.default.func.isRequired
}, _temp);
exports.default = AlpReduxModule;
//# sourceMappingURL=AlpReduxModuleBrowser.js.map