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
    visitor: (element, instance) => {
      // console.log(element, instance, instance instanceof AlpModule, element.type === AppContainer);

      if (instance && instance instanceof _AlpModule2.default) {
        [reducers] = instance.props;
        return false;
      }

      return true;
    },

    getReducers: () => reducers
  };
}; // import AppContainer from '../layout/AppContainer';
//# sourceMappingURL=createModuleVisitor.js.map