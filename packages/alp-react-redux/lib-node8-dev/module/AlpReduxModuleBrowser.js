'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _AlpModule = require('./AlpModule');

var _AlpModule2 = _interopRequireDefault(_AlpModule);

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReducerDictionaryType = _flowRuntime2.default.tdz(() => _types.ReducerDictionaryType);

const Node = _flowRuntime2.default.tdz(() => _react.Node);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('reducers', _flowRuntime2.default.nullable(_flowRuntime2.default.ref(ReducerDictionaryType))), _flowRuntime2.default.property('children', _flowRuntime2.default.ref(Node))));

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
    let _nextPropsType = _flowRuntime2.default.ref(_propTypes2.default);

    _flowRuntime2.default.param('nextProps', _nextPropsType).assert(nextProps);

    if (nextProps.reducers !== this.props.reducers) {
      this.setState({
        loading: this.setModuleReducers(nextProps.reducers)
      });
    }
  }

  render() {
    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(Node));

    return _returnType.assert(this.state.loading ? null : this.props.children);
  }
}, _class.contextTypes = {
  setModuleReducers: _propTypes2.default.func.isRequired
}, _temp);
exports.default = AlpReduxModule;
//# sourceMappingURL=AlpReduxModuleBrowser.js.map