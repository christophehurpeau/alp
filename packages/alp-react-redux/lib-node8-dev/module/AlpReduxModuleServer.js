'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = require('react');

var _AlpModule = require('./AlpModule');

var _AlpModule2 = _interopRequireDefault(_AlpModule);

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReducerDictionaryType = _flowRuntime2.default.tdz(() => _types.ReducerDictionaryType);

const Node = _flowRuntime2.default.tdz(() => _react.Node);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('reducers', _flowRuntime2.default.nullable(_flowRuntime2.default.ref(ReducerDictionaryType))), _flowRuntime2.default.property('children', _flowRuntime2.default.ref(Node))));

let AlpReduxModule = class extends _AlpModule2.default {

  render() {
    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(Node));

    return _returnType.assert(this.props.children);
  }
};
exports.default = AlpReduxModule;
//# sourceMappingURL=AlpReduxModuleServer.js.map