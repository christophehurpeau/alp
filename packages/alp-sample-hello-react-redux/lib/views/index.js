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

var _reducers = require('./reducers');

Object.defineProperty(exports, 'reducer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_reducers).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map
