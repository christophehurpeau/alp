'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AlpModule = require('./AlpModule');

var _AlpModule2 = _interopRequireDefault(_AlpModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let AlpReduxModule = class extends _AlpModule2.default {

  render() {
    return this.props.children;
  }
};
exports.default = AlpReduxModule;
//# sourceMappingURL=AlpReduxModuleServer.js.map