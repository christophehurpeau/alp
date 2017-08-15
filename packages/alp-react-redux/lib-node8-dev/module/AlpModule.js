'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReactNodeType = _flowRuntime2.default.tdz(() => _types.ReactNodeType);

const ReactElementType = _flowRuntime2.default.tdz(() => _types.ReactElementType);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('children', _flowRuntime2.default.ref(ReactNodeType))));

let AlpModule = (_temp = _class = class extends _react.Component {

  render() {
    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactElementType));

    if (this.props.reducers) {
      throw new Error('You have reducers, probably want to use AlpReduxModule.');
    }

    return _returnType.assert(this.props.children);
  }
}, _class.propTypes = _flowRuntime2.default.propTypes(PropsType), _temp);
exports.default = AlpModule;
//# sourceMappingURL=AlpModule.js.map