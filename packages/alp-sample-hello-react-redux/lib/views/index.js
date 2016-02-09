'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _IndexView = require('./IndexView');

Object.defineProperty(exports, 'View', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_IndexView).default;
  }
});

var _index = require('./reducers/index');

Object.defineProperty(exports, 'app', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map
