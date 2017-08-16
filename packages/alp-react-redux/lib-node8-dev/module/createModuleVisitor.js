'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AlpModule = require('./AlpModule');

var _AlpModule2 = _interopRequireDefault(_AlpModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function createModuleVisitor() {
  let reducers;

  return {
    visitor: (element, instance) => instance && instance instanceof _AlpModule2.default ? (reducers = instance.props.reducers, false) : true,

    getReducers: () => reducers
  };
}; // import AppContainer from '../layout/AppContainer';
//# sourceMappingURL=createModuleVisitor.js.map