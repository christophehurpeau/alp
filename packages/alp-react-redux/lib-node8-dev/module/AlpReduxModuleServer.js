'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReactNodeType = _flowRuntime2.default.tdz(() => _types.ReactNodeType);

const ReactElementType = _flowRuntime2.default.tdz(() => _types.ReactElementType);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('reducers', _flowRuntime2.default.object(_flowRuntime2.default.indexer('key', _flowRuntime2.default.string(), _flowRuntime2.default.any()))), _flowRuntime2.default.property('children', _flowRuntime2.default.ref(ReactNodeType))));

let AlpReduxModule = (_temp = _class = class extends _react.Component {

  constructor(props, context) {
    super(props, context);
    this.context.setModuleReducers(props.reducers);
  }

  render() {
    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactElementType));

    return _returnType.assert(this.props.children);
  }
}, _class.propTypes = _flowRuntime2.default.propTypes(PropsType), _class.contextTypes = {
  setModuleReducers: _propTypes2.default.func.isRequired
}, _temp);
exports.default = AlpReduxModule;
//# sourceMappingURL=AlpReduxModuleServer.js.map