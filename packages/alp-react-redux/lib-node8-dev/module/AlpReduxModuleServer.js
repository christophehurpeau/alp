'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _AlpModule = require('./AlpModule');

var _AlpModule2 = _interopRequireDefault(_AlpModule);

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReactNodeType = _flowRuntime2.default.tdz(() => _types.ReactNodeType);

const ReactElementType = _flowRuntime2.default.tdz(() => _types.ReactElementType);

const ReducerDictionaryType = _flowRuntime2.default.tdz(() => _types.ReducerDictionaryType);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('reducers', _flowRuntime2.default.nullable(_flowRuntime2.default.ref(ReducerDictionaryType))), _flowRuntime2.default.property('children', _flowRuntime2.default.ref(ReactNodeType))));

let AlpReduxModule = class extends _AlpModule2.default {

  render() {
    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactElementType));

    return _returnType.assert(this.props.children);
  }
};
exports.default = AlpReduxModule;
//# sourceMappingURL=AlpReduxModuleServer.js.map